<template>
    <div>
        <div class="">
            <span class="tit">我审批的报销申请 / 总数 : {{ total }}</span>
            <el-form :inline="true" :model="query">
                <el-form-item><el-input style="width:120px" v-model="query.likeKeyWords" placeholder="关键字" clearable></el-input></el-form-item>
                <el-form-item>
                    <el-select style="width:120px" clearable v-model="query.applyUserId" filterable placeholder="申请人">
                        <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select style="width:120px" clearable v-model="query.status" placeholder="请选择">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select style="width:120px" clearable v-model="query.type1" placeholder="总分类">
                        <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item>
                    <el-select v-model="query.orderBy" placeholder="排序方式">
                        <el-option v-for="item in orderByOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item><el-button type="primary" size="medium" v-on:click="getInvoiceApproverPage()" icon="el-icon-search">搜索</el-button></el-form-item>
                <el-form-item>
                    <router-link to="/apply/invoice/form"><el-button type="primary" size="medium">添加申请</el-button></router-link>
                </el-form-item>
                <el-form-item><el-button type="primary" size="medium" @click="exportExcel()">导出</el-button></el-form-item>
            </el-form>
            <el-radio-group v-model="listType" style="float: right;" @change="openList">
                <el-radio-button label="1">我申请的</el-radio-button>
                <el-radio-button label="2">我审批的</el-radio-button>
            </el-radio-group>
        </div>
        <el-table :data="list" id="out-table" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column width="80" label="序号">
                <template scope="scope">
                    <span>{{ scope.$index + (query.current - 1) * query.size + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="160" label="项目" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="scope.row.alias == null || scope.row.alias == ''">与项目无关</span>
                    <span v-else>{{ scope.row.alias }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="180" label="时间" prop="invoiceTime">
                <template slot-scope="scope">
                    <p v-if="scope.row.payTime">支付：{{ scope.row.payTime }}</p>
                    <p>发票：{{ scope.row.invoiceTime }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="applyUserName" min-width="120" label="申请人"></el-table-column>

            <el-table-column min-width="160" label="分类">
                <template slot-scope="scope">
                    <p v-if="scope.row.type1Name">{{ scope.row.type1Name }}</p>
                    <p v-if="scope.row.type2Name">{{ scope.row.type2Name }}</p>
                    <p v-if="scope.row.type3Name">{{ scope.row.type3Name }}</p>
                </template>
            </el-table-column>
            <el-table-column min-width="80" label="是否找票">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isFull == 0" type="danger">否</el-tag>
                    <el-tag v-if="scope.row.isFull == 1" type="success">是</el-tag>
                </template>
            </el-table-column>
            <el-table-column min-width="80" label="是否确认">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isAffirm == 0" type="danger">否</el-tag>
                    <el-tag v-if="scope.row.isAffirm == 1" type="success">是</el-tag>
                </template>
            </el-table-column>
            <el-table-column min-width="120" label="发票金额(元)" prop="invoicePriceYuan" sortable :sort-method="sortChange">
                <template slot-scope="scope">
                    <span>{{ scope.row.invoicePriceYuan }} 元</span>
                </template>
            </el-table-column>
            <el-table-column min-width="120" label="支付金额(元)" prop="payPriceYuan" sortable :sort-method="sortChange1">
                <template slot-scope="scope">
                    <span>{{ scope.row.payPriceYuan }} 元</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" min-width="100" label="审批状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="warning">审批中</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="success">同意</el-tag>
                    <el-tag v-if="scope.row.status == 2" type="danger">拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column min-width="160" label="创建时间" :show-overflow-tooltip="true" prop="createTime" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="110" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click.native="handInfo(scope.row)">查看&审批</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.current"
            :page-sizes="[10, 20, 50, 100, 499, 1000, 5000]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next"
            :total="total"
        ></el-pagination>
    </div>
</template>
<script>
// 表格导出
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import { getInvoiceApproverPage, getInvoices } from '../../../api/apply/invoice.js';
import { getUserList } from '../../../api/admin/user.js';
// import {getUserInfo} from "../../../api/admin/user.js";
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            query: {
                userId: null,
                likeKeyWords: '',
                applyUserId: null,
                status: '',
                type1: '',
                orderBy: 'create_time_desc',
                current: 1,
                size: 10
            },
            userOptions: [],
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
            classifyOptions: [
                {
                    value: '',
                    label: '全部'
                }
            ],

            pages: 0,
            total: 0,
            listLoading: false,
            list: [],
            number: '',
            listType: '2'
        };
    },
    created() {
        window.localStorage.removeItem('editInvoiceInfo');
        let page = sessionStorage.getItem('approverPage');
        if (page != null) {
            this.query.current = Number(page);
        }
        this.query.status = this.$route.query.status;
        if (!this.query.status) {
            this.query.status = '';
        }
        this.query.userId = this.userId;
        this.getUserList();
        this.getInvoiceApproverPage();
        this.getInvoices('-1');
    },
    computed: {
        ...mapGetters(['permissions', 'userId'])
    },
    methods: {
        getInvoices(id) {
            getInvoices(id, this.userId).then(res => {
                res.data.data.invoiceType.forEach(item => {
                    this.classifyOptions.push({
                        value: item.id,
                        label: item.name
                    });
                });
            });
        },
        sortChange(a, b) {
            //排序
            return a.invoicePriceYuan - b.invoicePriceYuan;
        },
        sortChange1(a, b) {
            //排序
            return a.payPriceYuan - b.payPriceYuan;
        },
        getUserList() {
            getUserList().then(response => {
                response.data.data.forEach(element => {
                    //console.log(element)
                    this.userOptions.push({
                        value: element.userId,
                        label: element.username
                    });
                });
            });
        },
        getInvoiceApproverPage() {
            this.listLoading = true;
            getInvoiceApproverPage(this.query)
                .then(response => {
                    console.log(response);
                    this.listLoading = false;
                    this.total = response.data.data.total;
                    this.query.current = response.data.data.current;
                    this.query.size = response.data.data.size;
                    this.list = response.data.data.records;
                })
                .catch(() => {
                    this.listLoading = false;
                });
        },
        handleSizeChange(val) {
            this.query.size = val;
            this.getInvoiceApproverPage();
        },
        handleCurrentChange(val) {
            this.query.current = val;
            sessionStorage.setItem('approverPage', val);
            this.getInvoiceApproverPage();
        },
        handInfo(data) {
            console.log(data);
            this.$router.push({
                path: '/apply/invoice/info/' + data.invoiceId
            });
        },
        openList(val) {
            if (val == 1) {
                this.$router.push({
                    path: '/apply/invoice'
                });
            }
        },
        exportExcel() {
            let fix = document.querySelector('.el-table__fixed-right');
            let wb;
            if (fix) {
                //判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
                wb = XLSX.utils.table_to_book(document.querySelector('#out-table').removeChild(fix));
                document.querySelector('#out-table').appendChild(fix);
            } else {
                wb = XLSX.utils.table_to_book(document.querySelector('#out-table'));
            }
            let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '我的报销审批列表.xlsx');
            } catch (e) {
                if (typeof console !== 'undefined') console.log(e, wbout);
            }
            return wbout;
        }
    },
    watch: {
        'query.likeKeyWords': {
            handler: function() {
                this.query.current = 1;
                this.getInvoiceApproverPage();
            }
        }
    }
};
</script>
<style type="text/scss" scope lang="scss"></style>
