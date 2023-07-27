<template>
    <el-upload
        multiple
        :limit="4"
        :on-exceed="onExceed"
        class="upload-demo"
        ref="upload"
        :action="baseUrl + '/cloud-work-order/file' + subUrl"
        :on-change="handleFileListChange"
        :on-remove="handleFileListChange"
        :on-error="handleUpLoadError"
        :on-success="handleUpLoadSuccess"
        :file-list="upLoadfileList"
        :data="uploadData"
        :list-type="allowedFormat"
        :accept="allowedFormat"
        :auto-upload="false"
    >
        <div class="upload-wrapper">
            <!-- <el-button slot="trigger" size="mini" plain round>+</el-button> -->
            <span class="add">+</span>
            <div class="upload-condition">
                <div>{{ $translate("格式") }}：{{ allowedFormat }}</div>
                <div>
                    {{ $translate("大小：单个附件最大") }}{{ maxFileSize }}M
                </div>
            </div>
        </div>
    </el-upload>
</template>

<script>
import { baseUrl } from "@/common/config";
import { showMessage } from "@/common/utils";
export default {
    name: "Index",
    data() {
        return {
            baseUrl,
            flag: false,
            upLoadfileList: [],
            allowedFormat:
                ".jpg,.jpeg,.png,.gif,.mp4,.xls,.xlsx,.doc,.pdf,.txt",
            formData: {
                title: "",
                startTime: "",
                description: "",
                plantId: "",
                dtuId: "",
                phone: "",
                email: "",
                remark: "",
            },
            completeCount: 0,
        };
    },
    props: {
        uploadData: {
            type: Object,
            default: (_) => {},
        },
        subUrl: {
            type: String,
            default: "",
        },
        maxFileSize: {
            type: Number,
            default: 10,
        },
    },
    methods: {
        submitUpload() {
            if (this.upLoadfileList.length) {
                this.$refs.upload.submit();
            } else {
                showMessage("success", this.$translate("提交成功"));
                this.$emit("e_upLoadComplete");
            }
        },
        handleUpLoadError(err) {
            console.log(err);
            showMessage("error", this.$translate("提交失败"));
        },
        handleFileListChange(file, upLoadfileList) {
            let sizeLimitExceeded = upLoadfileList.find(
                (item) => item.size / 1024 / 1024 > this.maxFileSize
            );
            this.$emit("e_sizeLimitExceeded", Boolean(sizeLimitExceeded));
            this.upLoadfileList = upLoadfileList;
        },
        handleUpLoadSuccess(response, file, fileList) {
            this.completeCount += 1;
            if (this.completeCount === fileList.length) {
                this.completeCount = 0;
                this.$refs.upload.clearFiles();
                this.$emit("e_upLoadComplete");
                showMessage("success", this.$translate("提交成功"));
            }
        },
        onExceed() {
            showMessage("warning", this.$translate("最多上传4个附件"));
        },
    },
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
    @include dis-flex();
    .add {
        font-size: 45px;
    }
    .upload-condition {
        font-size: 13px;
        color: #888;
        > div {
            text-align: left;
            margin-left: 15px;
            line-height: 20px;
        }
    }
}
</style>
