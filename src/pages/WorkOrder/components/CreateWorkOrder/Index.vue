<template>
    <el-dialog
        :title="$translate('提交工单')"
        :visible.sync="flag"
        width="650px"
        size="mini"
        :close-on-click-modal="false"
        @closed="closedDialog"
    >
        <el-form
            label-position="top"
            :model="formData"
            label-width="130px"
            size="medium"
        >
            <el-form-item :label="$translate('工单标题')">
                <el-input
                    v-model="formData.title"
                    auto-complete="off"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$translate('故障时间')">
                <el-date-picker v-model="formData.startTime" type="datetime">
                </el-date-picker>
            </el-form-item>
            <el-form-item :label="$translate('故障描述')">
                <el-input
                    v-model="formData.description"
                    type="textarea"
                    :rows="2"
                    auto-complete="off"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$translate('选择电站')">
                <el-select
                    v-model="formData.plantId"
                    clearable
                    @change="changePlant"
                >
                    <el-option
                        v-for="item in allPlants"
                        :key="item.plantId"
                        :label="item.name"
                        :value="item.plantId"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$translate('选择设备')">
                <el-select v-model="formData.dtuId" clearable>
                    <el-option
                        v-for="item in allDevices"
                        :key="item.id"
                        :label="item.sn"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$translate('手机号')">
                <el-input
                    v-model="formData.phone"
                    auto-complete="off"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$translate('邮箱')">
                <el-input
                    v-model="formData.email"
                    auto-complete="off"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$translate('备注')">
                <el-input
                    type="textarea"
                    :rows="3"
                    v-model="formData.remark"
                    auto-complete="off"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$translate('上传附件')">
                <Upload
                    ref="uploadCom"
                    subUrl="/uploadWorkOrderFile"
                    :uploadData="uploadData"
                    :maxFileSize="maxFileSize"
                    @e_sizeLimitExceeded="e_sizeLimitExceeded"
                    @e_upLoadComplete="e_upLoadComplete"
                />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button
                size="small"
                :disabled="btnDisable"
                @click="closedDialog(false)"
                >{{ $translate("取消") }}</el-button
            >
            <el-button
                size="small"
                :loading="btnDisable"
                type="primary"
                @click="handleSureAdd"
                >{{ $translate("确定") }}</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import { baseUrl } from "@/common/config";
import { showMessage } from "@/common/utils";
import { apiCreateOrder } from "@/api/user";
import { createNamespacedHelpers } from "vuex";
import { apiGetDealOrderList } from "@/api/user";
const { mapGetters: plant_getters, mapActions: plant_actions } =
    createNamespacedHelpers("plant");
const { mapGetters: device_getters, mapActions: device_actions } =
    createNamespacedHelpers("device");
export default {
    name: "CreateWorkOrder",
    data() {
        return {
            baseUrl,
            flag: false,
            uploadData: {},
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
            btnDisable: false,
            sizeLimitExceeded: false,
            maxFileSize: 10,
        };
    },
    props: {
        addWorkOrderFlag: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...plant_getters(["allPlants"]),
        ...device_getters(["allDevices"]),
    },
    components: {
        Upload: (_) => import("../Upload"),
    },
    methods: {
        ...device_actions(["getAllDevices"]),
        ...plant_actions(["getAllPlants"]),
        e_sizeLimitExceeded(flag) {
            this.sizeLimitExceeded = flag;
        },
        closedDialog(flag) {
            Object.keys(this.formData).forEach((key) => {
                this.formData[key] = "";
            });
            this.$emit("e_close", flag);
        },
        checkParams() {
            let { title, description, plantId, dtuId, phone, email } =
                this.formData;
            if (title === "") {
                return showMessage(
                    "warning",
                    this.$translate("请填写工单标题")
                );
            }
            if (description === "") {
                return showMessage(
                    "warning",
                    this.$translate("请填写故障描述")
                );
            }
            if (plantId === "" && dtuId === "") {
                return showMessage(
                    "warning",
                    this.$translate("请选择电站或设备")
                );
            }
            if (phone === "" && email === "") {
                return showMessage(
                    "warning",
                    this.$translate("请填写手机号或邮箱")
                );
            }
            return true;
        },
        async handleSureAdd() {
            if (this.sizeLimitExceeded) {
                return showMessage(
                    "error",
                    `${this.$translate("单个附件大小不能超过")}${maxFileSize}M`
                );
            }
            let flag = this.checkParams();
            if (flag !== true) return;
            this.btnDisable = true;
            let { data } = await apiCreateOrder(this.formData);
            if (data) {
                this.uploadData.processId = data.processId;
                this.$refs.uploadCom.submitUpload();
            }
        },
        changePlant(plantId) {
            this.formData.dtuId = "";
            this.getAllDevices({ plantId });
        },
        e_upLoadComplete() {
            this.btnDisable = false;
            this.closedDialog(true);
        },
    },
    watch: {
        addWorkOrderFlag(newVal) {
            this.flag = newVal;
            this.btnDisable = false;
            newVal && this.getAllPlants();
        },
    },
};
</script>

<style lang="scss" scoped>
>>> .el-form-item__label {
    @include dis-flex(flex-start, center);
}
>>> .el-form-item {
    margin-bottom: 10px;
    .el-form-item__label {
        padding: 0;
        line-height: 36px !important;
    }
    .el-input,
    .el-select {
        width: 100%;
    }
}
.allowedFormat {
    font-size: 14px;
    margin-left: 5px;
}
</style>
