<template>
    <div>
        <div class="">
            <span class="tit" style="color: #1e6abc">请假 / 总数 : {{ total }}</span>
            <el-form :inline="true" :model="query">
                <el-form-item>
                    <el-select style="width:120px" clearable :disabled="disabled" v-model="query.userId" filterable placeholder="请选择">
                        <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select style="width:120px" clearable v-model="query.status" placeholder="请选择">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item><el-button type="primary" size="medium" v-on:click="getLeaveList()" icon="el-icon-search">搜索</el-button></el-form-item>
                <el-form-item>
                    <router-link to="/apply/leave/form"><el-button type="primary" size="medium">添加申请</el-button></router-link>
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
            <el-table-column min-width="200" label="项目" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="scope.row.alias == null || scope.row.alias == ''">与项目无关</span>
                    <span v-else>{{ scope.row.alias }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="120" label="审批人">
                <template slot-scope="scope">
                    <div class="tag-group" v-for="item in scope.row.checkUserList">
                        <p>{{ item.checkUserName }}</p>
                        <el-tag v-if="item.check == 0" size="mini" type="warning">待审批</el-tag>
                        <el-tag v-if="item.check == 1" size="mini" type="success">已同意</el-tag>
                        <el-tag v-if="item.check == 2" size="mini" type="danger">已拒绝</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column min-width="100" label="类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">事假</span>
                    <span v-if="scope.row.type == 2">病假</span>
                    <span v-if="scope.row.type == 3">年假</span>
                    <span v-if="scope.row.type == 4">调休</span>
                    <span v-if="scope.row.type == 5">婚假</span>
                    <span v-if="scope.row.type == 6">产假</span>
                    <span v-if="scope.row.type == 7">陪产假</span>
                    <span v-if="scope.row.type == 8">丧假</span>
                    <span v-if="scope.row.type == 9">周六妈妈带娃</span>
                    <span v-if="scope.row.type == 10">周六培训学习</span>
                </template>
            </el-table-column>
            <el-table-column prop="start" min-width="120" label="开始时间"></el-table-column>
            <el-table-column prop="end" min-width="120" label="结束时间"></el-table-column>
            <el-table-column min-width="120" label="请假时长">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1 || scope.row.type == 2">{{ scope.row.time }} 小时</span>
                    <span v-else>{{ scope.row.time }} 天</span>
                </template>
            </el-table-column>
            <el-table-column prop="reason" min-width="150" label="事由" :show-overflow-tooltip="true"></el-table-column>
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
import { getLeaveList, deleteObj, leaveMigration } from '../../../api/apply/leave.js';
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
        window.localStorage.removeItem('editLeaveInfo');
        this.query.status = this.$route.query.status;
        if (!this.query.status) {
            this.query.status = '';
        }
        if (this.userId != 1 && this.userId != 9 && this.userId != 11 && this.userId != 87 && this.userId != 77) {
            this.disabled = true;
        }
        this.query.userId = this.userId;
        this.getLeaveList();
        this.getUserList();
    },
    computed: {
        ...mapGetters(['permissions', 'userId'])
    },
    methods: {
        getLeaveList() {
            this.listLoading = true;
            getLeaveList(this.query)
                .then(response => {
                    this.listLoading = false;
                    this.total = response.data.data.total;
                    this.query.current = response.data.data.current;
                    this.query.size = response.data.data.size;
                    this.list = response.data.data.records;
                    console.log(this.list);
                    this.list.forEach((item, index) => {
                        const clockInfo = JSON.parse(item.clockList);
                        console.log(clockInfo.status);
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
            this.getLeaveList();
        },
        handleCurrentChange(val) {
            this.query.current = val;
            this.getLeaveList();
        },
        handleModal(data) {
            console.log(data);
            window.localStorage.setItem('editLeaveInfo', JSON.stringify(data));
            this.$router.push({
                path: '/apply/leave/form'
            });
        },
        handInfo(data) {
            console.log(data);
            this.$router.push({
                path: '/apply/leave/info/' + data.leaveId
            });
        },
        handleDel(index, row) {
            if (row.leaveId) {
                this.$confirm('确认删除吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteObj(row.leaveId).then(res => {
                        if (res.data.data) {
                            this.getLeaveList();
                        }
                    });
                });
            }
        },
        openList(val) {
            if (val == 2) {
                this.$router.push({
                    path: '/apply/leave/approver'
                });
            }
        },
        getLeaveMigration() {
            leaveMigration().then(response => {});
        }
    },
    mounted() {}
};
</script>
<style type="text/scss" lang="scss"></style>
