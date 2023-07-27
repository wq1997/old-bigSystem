<template>
    <el-dialog
        :title="$translate('筛选条件')"
        :visible.sync="flag"
        width="500px"
        size="mini"
        :close-on-click-modal="false"
        @closed="mergeOptions"
    >
        <el-form label-width="80px" :model="formData" size="small">
            <el-form-item :label="$translate('用户')" v-if="userType >= 3">
                <el-select
                    v-model="formData.userId"
                    clearable
                    @change="changeUser"
                >
                    <el-option
                        v-for="item in allUsers"
                        :key="item.f0102_Id"
                        :label="item.name"
                        :value="item.f0102_Id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$translate('电站')">
                <el-select
                    v-model="formData.plantId"
                    clearable
                    @change="changePlant"
                >
                    <el-option
                        v-for="item in plants"
                        :key="item.plantId"
                        :label="item.name"
                        :value="item.plantId"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$translate('设备')">
                <el-select v-model="formData.dtuId" clearable>
                    <el-option
                        v-for="item in devices"
                        :key="item.id"
                        :label="item.sn"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$translate('状态')">
                <el-select v-model="formData.status" clearable>
                    <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="$translate(item.label)"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$translate('日期')">
                <DatePick
                    :defaultDate="formData.date"
                    :clearable="true"
                    size="small"
                    type="daterange"
                    @change="changeDate"
                ></DatePick>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="mergeOptions(false)">{{
                $translate("取消")
            }}</el-button>
            <el-button size="small" type="primary" @click="mergeOptions(true)"
                >{{ $translate("确定") }}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { showMessage } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
import { apiGetPlantsByUserId } from "@/api/plant";
import { apiGetAllDevices } from "@/api/device";
import { apiOrderUserSelect } from "@/api/user";
export default {
    name: "Screen",
    data() {
        return {
            flag: false,
            userType: 0,
            allUsers: [],
            plants: [],
            devices: [],
            statusList: [
                { label: "已接受", value: "accept" },
                { label: "已处理", value: "dealwith" },
                { label: "已结单", value: "sure" },
                { label: "已评价", value: "assess" },
                { label: "评价超时", value: "assessTimeout" },
            ],
            formData: {
                userId: "",
                plantId: "",
                dtuId: "",
                status: "",
                date: [],
            },
        };
    },
    props: {
        screenFlag: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this.userType = parseInt(this.$route.query.type);
        this.mergeOptions(true);
    },
    components: {
        DatePick: (_) => import("@/components/DatePick"),
    },
    methods: {
        async getUserSelect() {
            let { data } = await apiOrderUserSelect();
            this.allUsers = JSON.parse(data || "[]");
        },
        async getPlantsByUserId(userId) {
            let { data } = await apiGetPlantsByUserId({ userId });
            this.plants = data;
        },
        async getDevicesByPlantId(plantId) {
            let { data } = await apiGetAllDevices({ plantId });
            this.devices = JSON.parse(data || "[]");
        },
        async mergeOptions(flag) {
            let { userId, plantId, dtuId, status, date } = this.formData;
            let [start, end] = date && date.length ? date : ["", ""];
            let options = {
                userId,
                plantId,
                dtuId,
                status,
                start,
                end,
            };
            this.$emit("mergeOptions", flag ? options : "");
        },
        changeDate(value) {
            this.formData.date = value;
        },
        changeUser(userId) {
            this.formData.plantId = "";
            this.formData.dtuId = "";
            userId && this.getPlantsByUserId(userId);
        },
        changePlant(plantId) {
            this.formData.dtuId = "";
            plantId && this.getDevicesByPlantId(plantId);
        },
    },
    watch: {
        screenFlag(newVal) {
            this.flag = newVal;
            if (newVal) {
                if (this.userType >= 3) {
                    this.getUserSelect();
                } else {
                    this.getPlantsByUserId(this.$route.query.userId);
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
> .el-form-item {
    margin-bottom: 20px;
}

.el-input,
.el-select,
.el-range-editor {
    width: 90%;
}

.allowedFormat {
    font-size: 14px;
    margin-left: 5px;
}
</style>
