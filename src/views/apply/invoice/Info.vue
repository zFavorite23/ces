<template>
    <div>
        <el-button @click="backHistory" class="back">返回</el-button>

        <el-row :gutter="20">
            <el-col :xs="{ span: 24 }" :md="{ span: 12 }">
                <div class="title" style="margin-bottom:20px;">
                    <p class="name">报销申请单</p>
                    <table border="0" cellpadding="0" cellspacing="0" v-if="invoiceInfo">
                        <tr>
                            <td>姓名</td>
                            <td colspan="3">{{ invoiceInfo.applyUserName }}</td>
                        </tr>
                        <tr>
                            <td>项目名称</td>
                            <td colspan="3" v-if="invoiceInfo.alias != null">{{ invoiceInfo.alias }}</td>
                            <td colspan="3" v-else>与项目无关</td>
                        </tr>
                        <tr>
                            <td width="100">总分类</td>
                            <td>{{ invoiceInfo.type1Name }}</td>
                            <td width="100">明细分类</td>
                            <td>{{ invoiceInfo.type3Name }}</td>
                        </tr>
                        <tr v-if="invoiceInfo.type1 != 297">
                            <td>是否找票</td>
                            <td colspan="3" v-if="invoiceInfo.isFull == 0">否</td>
                            <td colspan="3" v-else-if="invoiceInfo.isFull == 1">是</td>
                        </tr>
                        <tr>
                            <td>报销支付描述</td>
                            <td colspan="3">{{ invoiceInfo.payDesc }}</td>
                        </tr>

                        <tr v-if="invoiceInfo.type1 != 10 && invoiceInfo.type1 != 22 && invoiceInfo.isFull == 1">
                            <td>支付时间</td>
                            <td colspan="3">{{ invoiceInfo.payTimeCh }}</td>
                        </tr>
                        <tr v-if="invoiceInfo.type1 == 297">
                            <td>支付时间</td>
                            <td colspan="3">{{ invoiceInfo.payTimeCh }}</td>
                        </tr>

                        <tr v-if="invoiceInfo.isFull == 1 && (invoiceInfo.type1 != 10 && invoiceInfo.type1 != 22)">
                            <td>支付金额</td>
                            <td>{{ invoiceInfo.payPriceYuan }} 元</td>
                            <td>支付截图数量</td>
                            <td v-if="invoiceInfo.payImgNum != null">{{ invoiceInfo.payImgNum }} 张</td>
                            <td v-else>无</td>
                        </tr>
                        <tr v-if="invoiceInfo.type1 == 297">
                            <td>支付金额</td>
                            <td>{{ invoiceInfo.payPriceYuan }} 元</td>
                            <td>支付截图数量</td>
                            <td v-if="invoiceInfo.payImgNum != null">{{ invoiceInfo.payImgNum }} 张</td>
                            <td v-else>无</td>
                        </tr>

                        <tr v-if="invoiceInfo.isFull == 1 && (invoiceInfo.type1 != 10 && invoiceInfo.type1 != 22)">
                            <td>支付截图</td>
                            <td colspan="3" v-if="invoiceInfo.payImg">
                                <!-- <el-image v-for="(url, index) in urls1" :key="url" :src="url" lazy @click="onPreview1(index)"></el-image> -->
                                <el-image v-for="(img, index) in urls1" :key="img" :src="img" lazy :preview-src-list="onPreview1(index)"></el-image>
                                <!-- <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]"></el-image-viewer> -->
                            </td>
                            <td colspan="3" v-else>无</td>
                        </tr>
                        <tr v-if="invoiceInfo.type1 == 297">
                            <td>支付截图</td>
                            <td colspan="3" v-if="invoiceInfo.payImg">
                                <!-- <el-image v-for="(url, index) in urls1" :key="url" :src="url" lazy @click="onPreview1(index)"></el-image> -->
                                <el-image v-for="(img, index) in urls1" :key="img" :src="img" lazy :preview-src-list="onPreview1(index)"></el-image>
                                <!-- <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]"></el-image-viewer> -->
                            </td>
                            <td colspan="3" v-else>无</td>
                        </tr>

                        <tr v-if="invoiceInfo.type1 != 297">
                            <td>发票描述</td>
                            <td colspan="3">{{ invoiceInfo.invoiceDesc }}</td>
                        </tr>
                        <tr v-if="invoiceInfo.type1 != 297">
                            <td>发票时间</td>
                            <td colspan="3">{{ invoiceInfo.invoiceTimeCh }}</td>
                        </tr>
                        <tr v-if="invoiceInfo.type1 != 297">
                            <td>发票金额</td>
                            <td>{{ invoiceInfo.invoicePriceYuan }} 元</td>
                            <td>发票数量</td>
                            <td>{{ invoiceInfo.invoiceImgNum }} 张</td>
                        </tr>
                        <tr v-if="invoiceInfo.type1 != 297">
                            <td>发票图片</td>
                            <td colspan="3" v-if="invoiceInfo.invoiceImg">
                                <el-image v-for="(img, index) in urls2" :key="img" :src="img" lazy :preview-src-list="onPreview2(index)"></el-image>
                                <!-- <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]"></el-image-viewer> -->
                            </td>
                            <td colspan="3" v-else>无</td>
                        </tr>
                        <tr v-if="invoiceInfo.type1 != 297">
                            <td>发票代码</td>
                            <td colspan="3">无</td>
                        </tr>
                        <tr>
                            <td>状态</td>
                            <td colspan="3">
                                <el-tag v-if="invoiceInfo.status == 0" type="warning">审批中</el-tag>
                                <el-tag v-else-if="invoiceInfo.status == 1" type="success">已同意</el-tag>
                                <el-tag v-else-if="invoiceInfo.status == 2" type="danger">已拒绝</el-tag>

                                <el-tag v-if="invoiceInfo.isAffirm == 1" type="success">已确认</el-tag>
                                <el-tag v-else-if="invoiceInfo.isAffirm == 0" type="danger">未确认</el-tag>

                                &nbsp;&nbsp;
                                <el-date-picker
                                    v-if="invoiceInfo.status == 1 && invoiceInfo.isAffirm == 0 && deptId == '7100'"
                                    v-model="month"
                                    value-format="yyyy-MM"
                                    format="yyyy 年 MM 月"
                                    type="month"
                                    placeholder="请选择归档月份"
                                    size="mini"
                                    style="width: 180px;margin-right: 15px;"
                                ></el-date-picker>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click.native="handleModalAffirm(invoiceInfo)"
                                    v-if="invoiceInfo.status == 1 && invoiceInfo.isAffirm == 0 && deptId == '7100'"
                                >
                                    确认收到票据
                                </el-button>
                            </td>
                        </tr>
                        <tr v-if="RefuseInfo.length == 0">
                            <td>审批历史</td>
                            <td colspan="3">
                                <el-tag type="warning">第{{ RefuseInfo.length + 1 }}次审批</el-tag>
                            </td>
                        </tr>
                        <tr v-else v-for="(item, index) in RefuseInfo" :key="index">
                            <td v-if="index == 0" :rowspan="RefuseInfo.length">拒绝历史</td>
                            <td colspan="3" style="height: 100px;">
                                <div style="color: #65CEA7;margin-top: 22px;">
                                    {{ item.checkUserName }}
                                    <i class="el-icon-time" style="color: #000;margin-left: 10px;margin-right: 5px" v-if="item.check > 0"></i>
                                    <span style="color: #000" v-if="item.check > 0">{{ item.updateTime }}</span>
                                </div>
                                <div style="color: #000000;margin-top: 15px;font-size: 12px">
                                    <el-tag type="warning">第{{ index + 1 }}次审批</el-tag>
                                    审批意见：{{ item.summary }}
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div><p class="name">审批结果</p></div>
                <div class="result" v-for="approver in approverList">
                    <el-avatar size="medium" :src="approver.checkUserAvatar" class="avatar"></el-avatar>
                    <span class="username" style="color: #65CEA7;">
                        {{ approver.checkUserName }}
                        <i class="el-icon-time" style="color: #000;margin-left: 10px;margin-right: 5px" v-if="approver.check > 0"></i>
                        <span style="color: #000" v-if="approver.check > 0">{{ approver.updateTime }}</span>
                    </span>
                    <span style="color: #000000;margin-top: 45px;position: absolute;font-size: 12px">审批意见：{{ approver.summary }}</span>
                    <div>
                        <span v-if="approver.check == 0 && approver.isBeing == 1">
                            <el-tag class="checkSty" type="warning">
                                <i class="el-icon-loading" style="margin-right:5px"></i>
                                审批中
                            </el-tag>
                        </span>
                        <span v-if="approver.check == 0 && approver.isBeing == 0">
                            <el-tag class="checkSty" type="">
                                <i class="el-icon-loading" style="margin-right:5px"></i>
                                待审批
                            </el-tag>
                        </span>
                        <span v-if="approver.check == 1">
                            <el-tag class="checkSty" type="success">
                                <i class="el-icon-success" style="margin-right:5px"></i>
                                已同意
                            </el-tag>
                        </span>
                        <span v-if="approver.check == 2">
                            <el-tag class="checkSty" type="danger">
                                <i class="el-icon-error" style="margin-right:5px"></i>
                                已拒绝
                            </el-tag>
                        </span>
                    </div>
                </div>

                <div v-if="showCheck">
                    <div class="title left"><p class="name">审批</p></div>
                    <el-alert title="审批流程不可逆转" type="warning"></el-alert>
                    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm res" style="width: 100%">
                        <el-radio-group v-model="formData.check" @change="selectChcek" style="margin-top: 10px;margin-left: 20px">
                            <el-radio label="1">同意</el-radio>
                            <el-radio label="2">拒绝</el-radio>
                        </el-radio-group>
                        <el-form-item prop="summary" style="margin-left: -100px;margin-top: 10px">
                            <el-input type="textarea" v-model="formData.summary" placeholder="请填写原因" maxlength="30" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item><el-button type="success" class="submit" @click="onSubmit" :loading="saving">提交</el-button></el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :xs="{ span: 24 }" :md="{ span: 12 }">
                <el-button class="print" style="" @click="print" v-if="invoiceInfo.status == 1 && formData.checkUserId == invoiceInfo.userId">打印</el-button>
                <div class="title" id="printContent" ref="print">
                    <p class="name" style="text-align: center">费用报销单</p>
                    <div style="width: 90%;margin-left:3%;">
                        <span style="color: #1f2d3d;display: inline-block;padding: 10px 10px 10px 0px;float: left; width: 40%;">
                            单位:
                            <span v-if="invoiceInfo.companyId == '2'">北京甲板智慧科技有限公司</span>
                            <span v-if="invoiceInfo.companyId == '3'">北京甲板数字科技有限公司</span>
                        </span>
                        <span style="color: #1f2d3d;display: inline-block;padding: 10px 0;float: left; width: 30%;" v-if="invoiceInfo.type1 == 297">
                            {{ invoiceInfo.payTimeCh }}
                        </span>
                        <span style="color: #1f2d3d;display: inline-block;padding: 10px 0;float: left; width: 30%;" v-if="invoiceInfo.type1 != 297">
                            {{ invoiceInfo.invoiceTimeCh }}
                        </span>
                        <span style="color: #1f2d3d;display: inline-block;padding: 10px 10px;float: right;text-align: right; margin-right: -3%;width: 20%;">
                            第
                            <span v-if="invoiceInfo.type1 == 22 || invoiceInfo.type1 == 10" style="padding: 0 2px;">2</span>
                            <span v-else style="padding: 0 2px;">1</span>
                            号
                        </span>
                    </div>
                    <table border="1" cellspacing="0" cellpadding="0" v-if="invoiceInfo" style="width: 90%;margin-left: 5%;">
                        <tr style="height: 110px;text-align: center">
                            <td width="200">摘要</td>
                            <td colspan="3" style="text-align: left; padding: 0 10px;">{{ invoiceInfo.invoiceDesc }}</td>
                        </tr>
                        <tr style="height: 110px;text-align: center">
                            <td width="200">金额</td>
                            <td colspan="3" style="padding: 0 10px;">
                                <span style="float: left;margin-top: 30px;">
                                    人民币(大写) :
                                    <u>{{ invoiceInfo.invoicePriceChYuan }}</u>
                                </span>
                                <div style="float: right;margin-top: 60px;margin-right: 10px;">
                                    ￥
                                    <u>{{ invoiceInfo.invoicePriceYuan }}</u>
                                </div>
                            </td>
                        </tr>
                        <tr style="height: 110px;text-align: center">
                            <td width="200">附单据张数</td>
                            <td width="400" style="text-align: left; padding: 0 10px;">{{ invoiceInfo.invoiceImgNum }}</td>
                            <td width="200">领款人签章</td>
                            <td width="400" style="text-align: left; padding: 0 10px;">{{ applyUser }}</td>
                        </tr>
                    </table>

                    <div style="display: flex;color: #000000;text-align:left;line-height: 60px;margin-left: 5%;">
                        <span style="flex:1;">审批人：{{ checkUser1 }}</span>
                        <span style="flex:1;">审核：{{ checkUser2 }}</span>
                        <span style="flex:1;">证明或验收：{{ checkUser3 }}</span>
                        <span style="flex:1;">经手：{{ applyUser }}</span>
                    </div>
                    <div style="height: 1px;border-top: 1px dotted #000000;width: 90%;margin: 5% 5%;display: none" id="line"></div>
                    <div style="height: 440px;border: 1px solid #000000;width: 90%;margin: 5% 5%;display: none" id="cont">
                        <h2 style="line-height: 440px;color: #000000;letter-spacing: 30px;text-align: center;">发票粘贴处</h2>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { getInvoiceInfo, affirmInvoice, getInvoiceApproverList, updateInvoiceApprover, getInvoiceRefuse } from '../../../api/apply/invoice.js';
import { print } from '../../../utils/utils';
import { mapGetters } from 'vuex';

import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import moment from 'moment';
export default {
    components: { ElImageViewer },
    data() {
        return {
            month: '',
            formData: {
                approverId: null,
                checkUserId: null,
                check: '1',
                summary: '同意'
            },
            invoiceInfo: {
                applyUserName: '',
                invoiceTime: ''
            },
            invoiceId: null,
            createTime: null,
            listLoading: false,
            list: [],
            approverList: [],
            rules: {
                summary: [{ required: true, message: '请填写原因' }]
            },
            previewTime: '',
            previewList: [],
            checkUser1: '',
            checkUser2: '',
            checkUser3: '',
            applyUser: '',
            showCheck: false,
            saving: false,
            url: '',
            urls1: [],
            urls2: [],
            showViewer: false, // 显示查看器
            RefuseInfo: []
        };
    },
    computed: {
        ...mapGetters(['permissions', 'userId', 'deptId'])
    },
    created() {
        this.invoiceId = this.$route.params.invoiceId;
        this.formData.checkUserId = this.userId;
        this.getInvoiceInfo();
        this.getInvoiceRefuse();
        // window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
    },
    methods: {
        getInvoiceRefuse() {
            getInvoiceRefuse(this.invoiceId).then(res => {
                console.log(res);
                this.RefuseInfo = res.data.data;
            });
        },
        getInvoiceInfo() {
            getInvoiceInfo(this.invoiceId).then(response => {
                this.invoiceInfo = response.data.data;
                console.log(this.invoiceInfo);
                this.invoiceInfo.invoiceTimeCh = moment(this.invoiceInfo.invoiceTime).format('YYYY年MM月DD日');
                this.invoiceInfo.payTimeCh = moment(this.invoiceInfo.payTime).format('YYYY年MM月DD日');
                this.urls1 = [];
                this.urls2 = [];
                if (this.invoiceInfo.payImg) {
                    this.invoiceInfo.payImg.split(',').forEach((item, index) => {
                        if (item) {
                            this.urls1.push(`${window.location.origin}/apply/invoice/` + item);
                        }
                    });
                }
                if (this.invoiceInfo.invoiceImg) {
                    this.invoiceInfo.invoiceImg.split(',').forEach((item, index) => {
                        if (item) {
                            this.urls2.push(`${window.location.origin}/apply/invoice/` + item);
                        }
                    });
                }

                if (this.invoiceInfo.type1 == 22 || this.invoiceInfo.type1 == 10) {
                    this.checkUser1 = '王铮';
                    this.checkUser3 = '王海清';
                    this.applyUser = '李长霖';
                } else {
                    this.applyUser = this.invoiceInfo.applyUserName;
                }

                this.getInvoiceApproverList();
            });
        },
        getInvoiceApproverList() {
            getInvoiceApproverList(this.invoiceId).then(response => {
                // console.log(response);
                this.approverList = response.data.data;
                this.approverList.forEach((item, index) => {
                    if (item.check == 0 && item.isBeing == 1 && item.userId == this.formData.checkUserId) {
                        this.formData.approverId = item.approverId;
                        this.showCheck = true;
                    }
                });
                if (this.invoiceInfo.status == 1) {
                    if (this.approverList.length == 2) {
                        this.checkUser1 = this.approverList[0].checkUserName;
                        this.checkUser3 = this.approverList[1].checkUserName;
                    }
                    if (this.approverList.length == 3) {
                        this.checkUser1 = this.approverList[0].checkUserName;
                        this.checkUser2 = this.approverList[1].checkUserName;
                        this.checkUser3 = this.approverList[2].checkUserName;
                    }
                }
            });
        },
        selectChcek() {
            if (this.formData.check == 1) {
                this.formData.summary = '同意';
            } else {
                this.formData.summary = '';
            }
        },
        onSubmit() {
            this.$confirm('请审批人审核发票信息、报销内容、项目名称后再同意，一经同意后流程不能逆转。', '温馨提示：', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false
            })
                .then(() => {
                    updateInvoiceApprover(this.formData)
                        .then(res => {
                            // console.log(res);
                            if (res.data.data) {
                                this.backHistory();
                            }
                        })
                        .finally(() => {
                            this.saving = false;
                        });
                })
                .catch(() => {
                    this.saving = false;
                });

            // console.log(this.formData);
        },
        backHistory() {
            this.$router.go(-1);
        },
        onPreview1(index) {
            // this.url = this.urls1[val];
            // this.showViewer = true;
            let arr = [];
            let i = 0;
            for (i; i < this.urls1.length; i++) {
                arr.push(this.urls1[i + index]);
                if (i + index >= this.urls1.length - 1) {
                    index = 0 - (i + 1);
                }
            }
            return arr;
        },
        closeViewer() {
            this.showViewer = false;
            this.url = '';
        },
        onPreview2(index) {
            // this.url = this.urls2[val];
            // this.showViewer = true;
            let arr = [];
            let i = 0;
            for (i; i < this.urls2.length; i++) {
                arr.push(this.urls2[i + index]);
                if (i + index >= this.urls2.length - 1) {
                    index = 0 - (i + 1);
                }
            }
            return arr;
        },
        print(e) {
            // this.remove();
            // let subOutputRankPrint = document.getElementById('printContent');
            // let newContent =subOutputRankPrint.innerHTML;
            // let oldContent = document.body.innerHTML;
            // document.body.innerHTML = newContent;
            // window.print();
            // // window.location.reload();
            // document.body.innerHTML = oldContent;
            // return false;
            this.remove();
            const windows = print(document.getElementById('printContent').innerHTML);
            windows.close();
        },
        remove() {
            document.getElementById('line').style.display = 'block';
            document.getElementById('cont').style.display = 'block';
            var hkey_path;
            hkey_path = 'HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\';
            try {
                var RegWsh = new ActiveXObject('WScript.Shell');
                RegWsh.RegWrite(hkey_path + 'header', '');
                RegWsh.RegWrite(hkey_path + 'footer', '');
            } catch (e) {}
        },
        handleModalAffirm(data) {
            //console.log(data)

            if (data.invoiceId) {
                this.$confirm('确认收到发票了吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const editData = {
                        invoiceId: data.invoiceId,
                        isAffirm: '1',
                        backMonth: this.month
                    };
                    console.log(this.month);
                    affirmInvoice(editData).then(res => {
                        if (res.data.data) {
                            this.getInvoiceInfo();
                        }
                    });
                });
            }
        }
    },
    mounted() {
        // window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month > 9 ? month : '0' + month;
        var toMonth = year + '-' + month;
        this.month = toMonth;
    }
};
</script>

<style scoped>
.paste {
    display: none;
}
.line {
    display: none;
}
@page {
    size: auto; /* auto is the initial value */
    margin: 0mm; /* this affects the margin in the printer settings */
}
html {
    background-color: #ffffff;
    margin: 0px; /* this affects the margin on the html before sending to printer */
}
body {
    border: solid 1px blue;
    margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
}
table {
    margin-top: 20px;
    color: #1f2d3d;
    width: 100%;
    border-right: 1px solid #1f2d3d;
    border-bottom: 1px solid #1f2d3d;
}
table td {
    padding: 10px 0;
    border-left: 1px solid #1f2d3d;
    border-top: 1px solid #1f2d3d;
}
.el-tag {
    line-height: 16px;
    height: auto;
}
.el-image {
    width: 100px;
}
.submit {
    float: right;
    margin-top: -10px;
}
.back {
    margin-top: 10px;
}
.title {
    text-align: center;
}
.name {
    font-size: 21px;
    color: #1f2d3d;
    padding: 10px 0 5px 0;
    text-align: center;
}
.time {
    font-size: 16px;
    color: #9d9e61;
    padding: 10px 0;
}
.result {
    max-width: 800px;
    height: 100px;
    border: 1px solid #f1f3f4;
    margin-bottom: 10px;
}
.avatar {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    height: 45px;
    width: 45px;
}
.username {
    margin-top: 22px;
    position: absolute;
}
.res {
    max-width: 800px;
    height: 200px;
    border: 1px solid #f1f3f4;
    padding: 10px;
}
.submit {
    float: right;
    margin-top: -10px;
}

.checkSty {
    float: right;
    right: 10px;
    margin-top: -60px;
    position: relative;
    line-height: 32px;
    height: 32px;
}
.result {
    max-width: 800px;
    height: 100px;
    border: 1px solid #f1f3f4;
    margin-bottom: 10px;
}
.avatar {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    height: 45px;
    width: 45px;
}
.print {
    float: right;
    background-color: #65cea7;
    color: #ffffff;
    position: absolute;
    right: 3%;
}
</style>
