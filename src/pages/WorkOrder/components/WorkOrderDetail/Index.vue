<template>
    <el-drawer
        class="order-drawer"
        :title="$translate('工单详情')"
        direction="ttb"
        size="90%"
        :visible.sync="flag"
        :modal-append-to-body="false"
        :before-close="closeDrawer"
    >
        <div class="workOrder-info">
            <div v-for="item in workOrderInfo" :key="item.key">
                <span class="label">{{ $translate(item.label) }}：</span>
                <span class="value">{{
                    item.key === "createTime"
                        ? c_formateDate(item.value)
                        : item.value
                }}</span>
            </div>
        </div>
        <div class="workOrder-files">
            <el-divider content-position="left">{{
                $translate("工单附件")
            }}</el-divider>
            <viewer :images="workOrderFiles">
                <template v-for="src in c_fileType(workOrderFiles).imgList">
                    <img :src="src" :key="src" />
                </template>
            </viewer>
            <div class="otherFileList">
                <template
                    v-for="(src, index) in c_fileType(workOrderFiles).otherList"
                >
                    <a :href="src" :key="src">{{ index + 1 }}_{{ src }}</a>
                </template>
            </div>
        </div>
        <div class="workOrder-communicate">
            <el-divider content-position="left">{{
                $translate("沟通记录")
            }}</el-divider>
            <div
                v-for="(item, index) in workOrderCommunicate"
                :key="index"
                :class="item.clientOrAdmin ? 'right' : 'left'"
            >
                <div class="communicate-name-title">
                    {{ item.userName }}
                    <el-divider direction="vertical"></el-divider>
                    {{ c_formateDate(item.createTime) }}
                </div>
                <div class="content">
                    <div class="content-text">{{ item.content }}</div>
                    <viewer :images="workOrderFiles">
                        <template v-for="src in c_fileType(item.files).imgList">
                            <img :src="src" :key="src" />
                        </template>
                    </viewer>
                    <div class="otherFileList">
                        <template
                            v-for="(src, index) in c_fileType(item.files)
                                .otherList"
                        >
                            <a :href="src" :key="src"
                                >{{ index + 1 }}_{{ src }}</a
                            >
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="workOrder-feedback"
            v-if="statusCode[workOrderDetail.statusCode] < 2"
        >
            <el-divider content-position="left">{{
                $translate("反馈")
            }}</el-divider>
            <el-input
                type="textarea"
                :rows="2"
                :placeholder="$translate('请输入反馈内容')"
                v-model="feedbackTextarea"
            >
            </el-input>
            <Upload
                ref="uploadCom"
                subUrl="/uploadCommentsFile"
                :uploadData="uploadData"
                :maxFileSize="maxFileSize"
                @e_sizeLimitExceeded="e_sizeLimitExceeded"
                @e_upLoadComplete="e_upLoadComplete"
            />
            <el-button
                type="primary"
                size="mini"
                @click="submitFeedback"
                class="submitFeedback-btn"
                :loading="btnDisable"
                >{{ $translate("提交") }}</el-button
            >
        </div>
        <div
            class="workOrder-assess"
            v-if="
                statusCode[workOrderDetail.statusCode] === 2 &&
                orderDetailIdListType.orderListType === '1'
            "
        >
            <el-divider content-position="left">{{
                $translate("评价")
            }}</el-divider>
            <div class="rate">
                <span>{{ $translate("打分") }}：</span>
                <el-rate
                    v-model="score"
                    text-color="#ff9900"
                    allow-half
                    show-score
                    score-template="{value}"
                ></el-rate>
            </div>
            <el-input
                type="textarea"
                :rows="2"
                :placeholder="$translate('请输入评价内容')"
                v-model="assessTextarea"
            >
            </el-input>
            <el-button
                type="primary"
                size="mini"
                @click="submitAssess"
                :loading="btnDisable"
                >{{ $translate("提交") }}</el-button
            >
        </div>

        <div class="workOrder-assessRecode" v-if="workOrderDetail.assess">
            <el-divider content-position="left">{{
                $translate("评价记录")
            }}</el-divider>
            <div>
                {{ $translate("评价时间") }}：{{
                    c_formateDate(workOrderDetail.assess.createTime)
                }}
            </div>
            <div style="display: flex">
                {{ $translate("打分") }}：
                <el-rate
                    v-model="workOrderDetail.assess.score"
                    disabled
                    text-color="#ff9900"
                    allow-half
                    show-score
                    score-template="{value}"
                ></el-rate>
            </div>
            <div>
                {{ $translate("评价内容") }}：{{
                    workOrderDetail.assess.content
                }}
            </div>
        </div>

        <div class="finish" v-if="statusCode[workOrderDetail.statusCode] < 2">
            <el-button
                type="danger"
                round
                plain
                @click="finishWorkOrder"
                :loading="btnDisable"
                >{{ $translate("结单") }}</el-button
            >
        </div>
    </el-drawer>
</template>

<script>
import {
    apiGetOrderFeedback,
    apiAddOrderFeedback,
    apiFinishOrder,
    apiAddOrderAssess,
} from "@/api/user";
import { momentFormate, showMessage, getFileType } from "@/common/utils";
export default {
    name: "WorkOrderDetail",
    data() {
        return {
            flag: false,
            btnDisable: false,
            uploadData: {},
            feedbackTextarea: "",
            score: 0,
            assessTextarea: "",
            workOrderDetail: {},
            workOrderInfo: [
                { label: "工单编号", key: "processId", value: "" },
                { label: "工单标题", key: "title", value: "" },
                { label: "提交时间", key: "createTime", value: "" },
                { label: "故障描述", key: "description", value: "" },
                { label: "状态", key: "statusCode", value: "" },
                { label: "电站", key: "plantName", value: "" },
                { label: "设备", key: "sn", value: "" },
                { label: "手机号", key: "phone", value: "" },
                { label: "邮箱", key: "email", value: "" },
                { label: "备注", key: "remark", value: "" },
            ],
            workOrderFiles: [],
            workOrderCommunicate: [],
            statusCode: {
                accept: 0, // 已接受
                dealwith: 1, // 已处理
                sure: 2, // 已结单
                assess: 3, // 已评价
                assessTimeout: 4, // 评价超时
            },
            imgType: ".jpg,.jpeg,.png,.gif",
            sizeLimitExceeded: false,
            maxFileSize: 10,
        };
    },
    props: {
        orderDetailIdListType: {
            type: Object,
            default: (_) => {},
        },
    },
    components: {
        Upload: (_) => import("../Upload"),
    },
    mounted() {
        String.prototype.endWith = (s) => {
            let d = this.length - s.length;
            return d >= 0 && this.lastIndexOf(s) == d;
        };
    },
    methods: {
        closeDrawer(flag) {
            this.feedbackTextarea = "";
            this.$emit("e_close", flag);
        },
        e_sizeLimitExceeded(flag) {
            this.sizeLimitExceeded = flag;
        },
        async getComments(workOrderId) {
            const loading = this.$loading({
                target: ".el-drawer__wrapper",
            });
            let { data } = await apiGetOrderFeedback({ workOrderId });
            loading.close();
            if (data) {
                this.workOrderDetail = data;
                this.workOrderFiles = data.files;
                this.workOrderCommunicate = data.comments;
                this.workOrderInfo.forEach(
                    (item) => (item.value = data[item.key])
                );
            }
        },
        async submitFeedback() {
            if (this.feedbackTextarea === "") {
                return showMessage(
                    "warning",
                    this.$translate("请输入反馈内容")
                );
            }
            if (this.sizeLimitExceeded) {
                return showMessage(
                    "error",
                    `${this.$translate("单个附件大小不能超过")}${maxFileSize}M`
                );
            }
            this.btnDisable = true;
            let { orderListType, workOrderId } = this.orderDetailIdListType;
            let requestData = {
                clientOrAdmin: orderListType === "1" ? true : false,
                content: this.feedbackTextarea,
                workOrderId,
            };
            let { data } = await apiAddOrderFeedback(requestData);
            if (data) {
                this.uploadData.commentId = data.commentId;
                this.$refs.uploadCom.submitUpload();
            }
        },
        async submitAssess() {
            if (this.assessTextarea === "") {
                return showMessage(
                    "warning",
                    this.$translate("请输入评价内容")
                );
            }
            let requestData = {
                score: this.score,
                content: this.assessTextarea,
                workOrderId: this.orderDetailIdListType.workOrderId,
            };
            let { code } = await apiAddOrderAssess(requestData);
            if (code === "ok") {
                showMessage("success", this.$translate("评价成功"));
                this.closeDrawer(true);
            }
        },
        finishWorkOrder() {
            this.$confirm(
                this.$translate("结单后不能继续反馈"),
                this.$translate("系统提示"),
                {
                    confirmButtonText: this.$translate("确定"),
                    cancelButtonText: this.$translate("取消"),
                    type: "warning",
                }
            ).then(async (_) => {
                let { code } = await apiFinishOrder({
                    workOrderId: this.orderDetailIdListType.workOrderId,
                });
                if (code === "ok") {
                    showMessage("success", this.$translate("结单成功"));
                    this.closeDrawer(true);
                }
            });
        },
        e_upLoadComplete(err) {
            this.btnDisable = false;
            this.closeDrawer(true);
        },
    },
    computed: {
        c_formateDate() {
            return (time) => momentFormate(time, "YYYY-MM-DD HH:mm:ss");
        },
        c_fileType() {
            return (srcList) => {
                let imgList = [],
                    otherList = [];
                srcList.forEach((item) => {
                    let type = getFileType(item);
                    if (this.imgType.includes(type)) {
                        imgList.push(item);
                    } else {
                        otherList.push(item);
                    }
                });
                return {
                    imgList,
                    otherList,
                };
            };
        },
    },
    watch: {
        orderDetailIdListType({ workOrderId }) {
            this.flag = Boolean(workOrderId);
            workOrderId && this.getComments(workOrderId);
        },
    },
};
</script>

<style lang="scss" scoped>
>>> :focus {
    outline: none;
}
.el-divider__text {
    font-weight: bolder;
}
>>> .el-textarea__inner {
    height: 150px;
    width: 80%;
    max-width: 800px;
    margin-bottom: 10px;
}
>>> .el-drawer {
    .el-drawer__header {
        font-weight: bold;
    }
    .el-drawer__body {
        font-size: 14px;
        padding: 0 100px;
        box-sizing: border-box;
        overflow-y: scroll;
        img {
            width: 200px;
            height: 100px;
            margin: 5px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            cursor: zoom-in;
        }
        > div {
            padding: 10px 30px;
            background: $bgColor-wrapper;
            margin-bottom: 20px;
        }
        .workOrder-info {
            @include dis-flex();
            > div {
                width: 33.3%;
                margin: 15px 0;
                .label {
                    font-weight: bolder;
                }
            }
        }
        .workOrder-files {
            @include dis-flex();
            .otherFileList {
                margin-left: 10px;
                @include dis-flex(flex-start, flex-start, column);
                > a {
                    margin-bottom: 15px;
                }
            }
        }
        .workOrder-communicate {
            &::after {
                content: "";
                clear: both;
                display: block;
            }
            .communicate-name-title {
                font-weight: bolder;
            }
            .content {
                padding: 20px;
                border-radius: 10px;
                margin: 10px 0 20px;
                text-align: left;
                .content-text {
                    margin-bottom: 10px;
                }
                .otherFileList {
                    @include dis-flex(flex-start, flex-start, row);
                    > a {
                        margin: 5px 0;
                    }
                }
            }
            .left,
            .right {
                width: 51%;
            }
            .left {
                float: left;
                .content {
                    background-color: $bgColor-wrapper;
                    border: 1px solid #8080808a;
                }
            }
            .right {
                float: right;
                text-align: right;
                .content {
                    background-color: $bgColor-wrapper;
                    border: 1px solid #50bcdf;
                }
            }
        }
        .workOrder-feedback {
            .submitFeedback-btn {
                margin-top: 10px;
            }
        }
        .workOrder-assess {
            .rate {
                @include dis-flex();
                margin-bottom: 10px;
            }
        }
        .workOrder-assessRecode {
            > div:not(:first-child) {
                margin-bottom: 15px;
            }
        }
        .finish {
            text-align: center;
            background: #eef2f8;
        }
    }
}
</style>
