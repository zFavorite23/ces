<template>
    <div>
        <div class="">
            <span class="tit">未打卡 / 总数 : {{ total }}</span>
            <el-form :inline="true" :model="query">
                <el-form-item>
                    <el-select style="width:120px" :disabled="disabled" v-model="query.userId" filterable placeholder="请选择">
                        <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select style="width:120px" clearable v-model="query.status" placeholder="请选择">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item><el-button type="primary" size="medium" v-on:click="getClockList()" icon="el-icon-search">搜索</el-button></el-form-item>
                <el-form-item>
                    <router-link to="/apply/clock/form"><el-button type="primary" size="medium">添加申请</el-button></router-link>
                </el-form-item>
            </el-form>
            <el-radio-group v-model="listType" style="float: right;" @change="openList">
                <el-radio-button label="1">我申请的</el-radio-button>
                <el-radio-button label="2">我审批的</el-radio-button>
            </el-radio-group>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column width="50" label="序号">
                <template scope="scope">
                    <span>{{ scope.$index + (query.current - 1) * query.size + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column width="120" label="申请人">
                <template scope="scope">
                    <span>{{ scope.row.applyUserName }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100" label="审批人">
                <template slot-scope="scope">
                    <div class="tag-group" v-for="item in scope.row.checkUserList">
                        <p>{{ item.checkUserName }}</p>
                        <el-tag v-if="item.check == 0" size="mini" type="warning">待审批</el-tag>
                        <el-tag v-if="item.check == 1" size="mini" type="success">已同意</el-tag>
                        <el-tag v-if="item.check == 2" size="mini" type="danger">已拒绝</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="day" min-width="100" label="未打卡日期"></el-table-column>
            <el-table-column prop="time" min-width="100" label="未打卡时间"></el-table-column>
            <el-table-column prop="reason" min-width="180" label="未打卡原因" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="status" min-width="100" label="审批状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="warning">审批中</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="success">同意</el-tag>
                    <el-tag v-if="scope.row.status == 2" type="danger">拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click.native="handInfo(scope.row)">查看</el-button>
                    <el-button size="mini" v-if="scope.row.status != 1" @click.native="handleModal(scope.row)">编辑</el-button>
                    <el-button size="mini" v-if="scope.row.status == 0" type="danger" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.current"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next"
            :total="total"
        ></el-pagination>
    </div>
</template>
<script>
import { getUserList } from '../../../api/admin/user.js';
import { getClockList, deleteObj, clockMigration } from '../../../api/apply/clock.js';
// import {getUserInfo} from "../../../api/admin/user.js";
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            query: {
                userId: null,
                status: '',
                current: 1,
                size: 10
            },
            statusOptions: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '0',
                    label: '审批中'
                },
                {
                    value: '1',
                    label: '同意'
                },
                {
                    value: '2',
                    label: '拒绝'
                }
            ],
            pages: 0,
            total: 0,
            listLoading: false,
            list: [],
            number: '',
            listType: '1',
            userOptions: [],
            disabled: false
        };
    },
    created() {
        window.localStorage.removeItem('editClockInfo');
        this.query.status = this.$route.query.status;
        if (!this.query.status) {
            this.query.status = '';
        }
        if (this.userId != 1&& this.userId != 77) {
            this.disabled = true;
        }
        this.query.userId = this.userId;
        this.getClockList();
        this.getUserList();
    },
    computed: {
        ...mapGetters(['permissions', 'userId'])
    },
    methods: {
        getClockList() {
            this.listLoading = true;
            getClockList(this.query)
                .then(response => {
                    this.listLoading = false;
                    this.total = response.data.data.total;
                    this.query.current = response.data.data.current;
                    this.query.size = response.data.data.size;
                    this.list = response.data.data.records;
                    this.list.forEach((item, index) => {
                        const clockInfo = JSON.parse(item.clockList);
                        this.list[index].clockDay = clockInfo.day;
                        this.list[index].clockTime = clockInfo.time;
                        this.list[index].clockStatus = clockInfo.status;
                    });
                })
                .catch(() => {
                    this.listLoading = false;
                });
        },
        getUserList() {
            getUserList().then(response => {
                console.log(response);
                response.data.data.forEach(element => {
                    //console.log(element)
                    this.userOptions.push({
                        value: element.userId,
                        label: element.username
                    });
                });
            });
        },
        handleSizeChange(val) {
            this.query.size = val;
            this.getLoglist();
        },
        handleCurrentChange(val) {
            this.query.current = val;
            this.getLoglist();
        },
        handleModal(data) {
            window.localStorage.setItem('editClockInfo', JSON.stringify(data));
            this.$router.push({
                path: '/apply/clock/form'
            });
        },
        handInfo(data) {
            console.log(data);
            this.$router.push({
                path: '/apply/clock/info/' + data.clockId
            });
        },
        handleDel(index, row) {
            if (row.clockId) {
                this.$confirm('确认删除吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    console.log('杀出');
                    deleteObj(row.clockId).then(res => {
                        if (res.data.data) {
                            this.getClockList();
                        }
                    });
                    // deleteUser(row.userId).then(res => {
                    //     if (res.data.data) {
                    //         this.getUserList();
                    //     }
                    // })
                });
            }
        },
        openList(val) {
            if (val == 2) {
                this.$router.push({
                    path: '/apply/clock/approver'
                });
            }
        },
        getClockMigration() {
            clockMigration().then(response => {});
        }
    },
    mounted() {}
};
</script>
<style type="text/scss" scope lang="scss"></style>
