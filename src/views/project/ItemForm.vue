<template>
    <div>
        <el-form label-position="right" :model="formData" :rules="rules" ref="formData" label-width="100px" style="max-width: 800px;">
            <el-form-item label="类别" prop="type">
                <el-radio-group v-model="formData.type" @change="typeChange">
                    <el-radio label="1">项目</el-radio>
                    <el-radio label="2">产品</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="合同名称">
                <el-input v-model="formData.name" placeholder="请填写合同名称"></el-input>
                <el-tag size="mini" type="danger">备注:立项所有项目名称用合同名称，未签署合同的与项目别名一致</el-tag>
            </el-form-item>
            <el-form-item :label="aliasName" prop="alias">
                <el-input v-model="formData.alias" placeholder="请填写别名"></el-input>
                <el-tag size="mini" type="danger">项目别名包含 甲方（如正和、万科，有些市政项目可以不加）- 地名（长春）- 项目描述（伊通河湿地智慧系统）</el-tag>
            </el-form-item>

            <el-row>
                <el-col :md="{ span: 8 }" :xs="{ span: 24 }">
                    <el-form-item :label="userName" prop="userId">
                        <el-select v-model="formData.userId" filterable placeholder="请选择">
                            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!--                <el-col :md="{ span: 8 }" :xs="{ span: 24 }">-->
                <!--                    <el-form-item label="销售负责人">-->
                <!--                        <el-select v-model="formData.sell" placeholder="请选择">-->
                <!--                            <el-option-->
                <!--                                v-for="item in userOptions"-->
                <!--                                :key="item.value"-->
                <!--                                :label="item.label"-->
                <!--                                :value="item.value"-->
                <!--                                :disabled="item.disabled"-->
                <!--                            >-->
                <!--                            </el-option>-->
                <!--                        </el-select>-->
                <!--                    </el-form-item>-->
                <!--                </el-col>-->
                <!--                <el-col :md="{ span: 8 }" :xs="{ span: 24 }">-->
                <!--                    <el-form-item label="商务负责人">-->
                <!--                        <el-select-->
                <!--                            v-model="formData.business"-->
                <!--                            placeholder="请选择"-->
                <!--                        >-->
                <!--                            <el-option-->
                <!--                                v-for="item in businessOptions"-->
                <!--                                :key="item.value"-->
                <!--                                :label="item.label"-->
                <!--                                :value="item.value"-->
                <!--                                :disabled="item.disabled"-->
                <!--                            >-->
                <!--                            </el-option>-->
                <!--                        </el-select>-->
                <!--                    </el-form-item>-->
                <!--                </el-col>-->
            </el-row>

            <el-form-item label="项目成员">
                <el-checkbox-group v-model="formData.teamList">
                    <el-checkbox v-for="item in userOptions" :label="item.value" border style="width: 100px;">{{ item.label }}</el-checkbox>
                    <!--                    <el-checkbox label="杜国庆" border disabled></el-checkbox>-->
                </el-checkbox-group>
            </el-form-item>

            <!--            <el-row>-->
            <!--                <el-col :md="{ span: 8 }" :xs="{ span: 24 }">-->
            <!--                    <el-form-item label="场景营建">-->
            <!--                        <el-select-->
            <!--                            v-model="formData.scene"-->
            <!--                            multiple-->
            <!--                            collapse-tags-->
            <!--                            placeholder="请选择"-->
            <!--                        >-->
            <!--                            <el-option-->
            <!--                                v-for="item in sceneOptions"-->
            <!--                                :key="item.value"-->
            <!--                                :label="item.label"-->
            <!--                                :value="item.value"-->
            <!--                                :disabled="item.disabled"-->
            <!--                            >-->
            <!--                            </el-option>-->
            <!--                        </el-select>-->
            <!--                    </el-form-item>-->
            <!--                </el-col>-->
            <!--                <el-col :md="{ span: 8 }" :xs="{ span: 24 }">-->
            <!--                    <el-form-item label="实施指导">-->
            <!--                        <el-select-->
            <!--                            v-model="formData.guide"-->
            <!--                            multiple-->
            <!--                            collapse-tags-->
            <!--                            placeholder="请选择"-->
            <!--                        >-->
            <!--                            <el-option-->
            <!--                                v-for="item in guideOptions"-->
            <!--                                :key="item.value"-->
            <!--                                :label="item.label"-->
            <!--                                :value="item.value"-->
            <!--                                :disabled="item.disabled"-->
            <!--                            >-->
            <!--                            </el-option>-->
            <!--                        </el-select>-->
            <!--                    </el-form-item>-->
            <!--                </el-col>-->
            <!--                <el-col :md="{ span: 8 }" :xs="{ span: 24 }">-->
            <!--                    <el-form-item label="软件需求">-->
            <!--                        <el-select-->
            <!--                            v-model="formData.need"-->
            <!--                            multiple-->
            <!--                            collapse-tags-->
            <!--                            placeholder="请选择"-->
            <!--                        >-->
            <!--                            <el-option-->
            <!--                                v-for="item in needOptions"-->
            <!--                                :key="item.value"-->
            <!--                                :label="item.label"-->
            <!--                                :value="item.value"-->
            <!--                                :disabled="item.disabled"-->
            <!--                            >-->
            <!--                            </el-option>-->
            <!--                        </el-select>-->
            <!--                    </el-form-item>-->
            <!--                </el-col>-->
            <!--            </el-row>-->

            <!--            <el-row>-->
            <!--                <el-col :md="{ span: 8 }" :xs="{ span: 24 }">-->
            <!--                    <el-form-item label="可视化">-->
            <!--                        <el-select-->
            <!--                            v-model="formData.visual"-->
            <!--                            multiple-->
            <!--                            collapse-tags-->
            <!--                            placeholder="请选择"-->
            <!--                        >-->
            <!--                            <el-option-->
            <!--                                v-for="item in visualOptions"-->
            <!--                                :key="item.value"-->
            <!--                                :label="item.label"-->
            <!--                                :value="item.value"-->
            <!--                                :disabled="item.disabled"-->
            <!--                            >-->
            <!--                            </el-option>-->
            <!--                        </el-select>-->
            <!--                    </el-form-item>-->
            <!--                </el-col>-->
            <!--                <el-col :md="{ span: 8 }" :xs="{ span: 24 }">-->
            <!--                    <el-form-item label="智慧化">-->
            <!--                        <el-select-->
            <!--                            v-model="formData.wisdom"-->
            <!--                            multiple-->
            <!--                            collapse-tags-->
            <!--                            placeholder="请选择"-->
            <!--                        >-->
            <!--                            <el-option-->
            <!--                                v-for="item in wisdomOptions"-->
            <!--                                :key="item.value"-->
            <!--                                :label="item.label"-->
            <!--                                :value="item.value"-->
            <!--                                :disabled="item.disabled"-->
            <!--                            >-->
            <!--                            </el-option>-->
            <!--                        </el-select>-->
            <!--                    </el-form-item>-->
            <!--                </el-col>-->
            <!--                <el-col :md="{ span: 8 }" :xs="{ span: 24 }">-->
            <!--                    <el-form-item label="产品研发">-->
            <!--                        <el-select-->
            <!--                            v-model="formData.product"-->
            <!--                            multiple-->
            <!--                            collapse-tags-->
            <!--                            placeholder="请选择"-->
            <!--                        >-->
            <!--                            <el-option-->
            <!--                                v-for="item in productOptions"-->
            <!--                                :key="item.value"-->
            <!--                                :label="item.label"-->
            <!--                                :value="item.value"-->
            <!--                                :disabled="item.disabled"-->
            <!--                            >-->
            <!--                            </el-option>-->
            <!--                        </el-select>-->
            <!--                    </el-form-item>-->
            <!--                </el-col>-->
            <!--            </el-row>-->

            <!--            <el-form-item label="现场和运维">-->
            <!--                <el-select-->
            <!--                    v-model="formData.site"-->
            <!--                    multiple-->
            <!--                    collapse-tags-->
            <!--                    placeholder="请选择"-->
            <!--                >-->
            <!--                    <el-option-->
            <!--                        v-for="item in siteOptions"-->
            <!--                        :key="item.value"-->
            <!--                        :label="item.label"-->
            <!--                        :value="item.value"-->
            <!--                        :disabled="item.disabled"-->
            <!--                    >-->
            <!--                    </el-option>-->
            <!--                </el-select>-->
            <!--            </el-form-item>-->

            <el-form-item label="状态" prop="status">
                <el-select v-model="formData.status" placeholder="请选择">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-row v-if="formData.type == '1'">
                <el-col :md="{ span: 8 }">
                    <el-form-item label="合同金额：" prop="contractAmountYuan">
                        <el-input type="text" placeholder="请输入合同金额" v-model="formData.contractAmountYuan"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="完工日期：" prop="endDate">
                <el-date-picker
                    v-model="formData.endDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    class="complete"
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="审批人：">
                <div v-if="formData.type == 1" class="apply-user-list" v-for="user in applyUserList">
                    <el-avatar :size="60" :src="user.avatar"></el-avatar>
                    <span class="username">{{ user.username }}</span>
                </div>
                <div v-if="formData.type == 2" class="apply-user-list" v-for="user in applyUserList2">
                    <el-avatar :size="60" :src="user.avatar"></el-avatar>
                    <span class="username">{{ user.username }}</span>
                </div>
            </el-form-item>
            <el-form-item style="text-align: center">
                <el-button type="primary" @click="onSubmit" :loading="saving">保存</el-button>
                <el-button @click="backHistory">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { addItem, editItem } from '../../api/project/item.js';
import { getUserList } from '../../api/admin/user.js';
import { getItemVosWithItemId } from '../../api/project/team.js';
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            aliasName: '项目别名',
            userName: '总协调',
            formData: {
                newData: true,
                itemId: '',
                userId: null,
                type: '1',
                name: '',
                alias: '',
                teamList: [],
                status: '0',
                endDate: '',
                contractAmountYuan: 0,
                approverids: ''
            },
            statusOptions: [
                {
                    value: '0',
                    label: '未签'
                },
                {
                    value: '1',
                    label: '已签未付'
                },
                {
                    value: '11',
                    label: '已签已付1'
                },
                {
                    value: '12',
                    label: '已签已付2'
                },
                {
                    value: '13',
                    label: '已签已付3'
                },
                {
                    value: '14',
                    label: '已签已付4'
                },
                {
                    value: '15',
                    label: '已签已付5'
                },
                {
                    value: '5',
                    label: '付清未完成'
                },
                {
                    value: '6',
                    label: '付清已完成'
                },
                {
                    value: '9',
                    label: '结项'
                }
            ],
            userOptions: [],
            saving: false,
            rules: {
                type: [{ required: true, message: '请选择类别', trigger: 'change' }],
                alias: [
                    {
                        required: true,
                        message: '请填写项目别名',
                        trigger: 'blur'
                    }
                ],
                userId: [{ required: true, message: '请选择', trigger: 'change' }],
                status: [{ required: true, message: '请选择', trigger: 'change' }],
                contractAmountYuan: [{ required: true, message: '请填【与' }]
                // endDate: [
                //     { required: true, message: '请选择', trigger: 'change' },
                // ]
            },
            applyUserList: [
                {
                    userId: '12',
                    username: '伍晓苑',
                    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELZRia3451hkfbsd4LrTrJgNB0elwzR9LGQcGczTibaN3WvaWf5U14oSGJrQb0JTbdPSIKSF7MNhhPQ/132'
                }
            ],
            applyUserList2: [
                {
                    userId: '14',
                    username: '徐金波',
                    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI3tWGQkicicpiacbnA2PvkrgnCHXafsZUeFAB2DTmlTXDj4454J7l2NO1LLBPpFWjy85VOEiaWNMdhgw/132'
                }
            ]
        };
    },
    created() {
        this.formData.userId = this.userId;
        this.getUserList();

        const editProjectInfo = JSON.parse(window.localStorage.getItem('editProjectInfo'));
        if (editProjectInfo) {
            this.typeChange(editProjectInfo.type);
            this.formData.newData = false;
            this.formData.itemId = editProjectInfo.itemId;
            this.formData.userId = editProjectInfo.userId;
            this.formData.type = editProjectInfo.type;
            this.formData.name = editProjectInfo.name;
            this.formData.alias = editProjectInfo.alias;

            this.getItemVosWithItemId(editProjectInfo.itemId);

            this.formData.status = editProjectInfo.status;
            this.formData.endDate = editProjectInfo.endDate;
            this.formData.contractAmountYuan = editProjectInfo.contractAmountYuan;
        }
    },
    computed: {
        ...mapGetters(['permissions', 'userId'])
    },
    methods: {
        getItemVosWithItemId(itemId) {
            getItemVosWithItemId(itemId).then(response => {
                response.data.data.forEach(element => {
                    this.formData.teamList.push(element.userId);
                });
            });
        },
        getUserList() {
            getUserList().then(response => {
                response.data.data.forEach(element => {
                    this.userOptions.push({
                        value: element.userId,
                        label: element.username
                    });
                });
            });
        },
        teamSelect(val) {
            console.log(val);
        },
        typeChange(val) {
            this.aliasName = val === '1' ? '项目别名' : '产品别名';
            this.userName = val === '1' ? '总协调' : '产品经理';
        },
        backHistory() {
            window.localStorage.removeItem('editProjectInfo');
            this.formData.newData = true;
            this.formData.itemId = '';
            this.formData.userId = '';
            this.formData.type = '1';
            this.formData.name = '';
            this.formData.alias = '';
            this.formData.status = '';
            this.formData.endDate = '';
            this.formData.contractAmountYuan = 0;
            this.$router.go(-1);
        },
        onSubmit() {
            if (this.formData.type == 1) {
                this.formData.approverids = '12';
            }
            if (this.formData.type == 2) {
                this.formData.approverids = '14';
            }
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    var aliasList = this.formData.alias.split('-');
                    if (aliasList.length < 2) {
                        this.$message.error('项目别名不规范');
                        return false;
                    }
                    this.saving = true;
                    if (!this.formData.newData) {
                        editItem(this.formData)
                            .then(res => {
                                if (res.data.data) {
                                    this.backHistory();
                                }
                            })
                            .finally(() => {
                                this.saving = false;
                            });
                    } else {
                        addItem(this.formData)
                            .then(res => {
                                if (res.data.data) {
                                    this.backHistory();
                                }
                            })
                            .finally(() => {
                                this.saving = false;
                            });
                    }
                }
            });
        }
    },
    mounted() {}
};
</script>
<style type="text/scss" scoped lang="scss">
.el-input .el-input__count .el-input__count-inner {
    height: 50%;
}
@media (min-width: 600px) {
    .zzz {
        display: none;
    }
}
.el-image img {
    border-radius: 50%;
}
@media screen and (max-width: 320px) {
    .complete {
        width: 173px !important;
    }
}
@media screen and (max-width: 360px) {
    .complete {
        width: 213px !important;
    }
}
@media screen and (max-width: 410px) {
    .complete {
        width: 217px !important;
    }
}
</style>
