<template>
    <div>
        <CommandPlane>
            <template #title>
                <span>{{ $translate("充放电时段设置") }}</span>
                <div>
                    <el-button type="success" size="mini" @click="add" :disabled="btnParams.isDisable">{{
                            $translate("添加")
                    }}</el-button>
                    <el-button type="danger" size="mini" @click="clear" :disabled="btnParams.isDisable">{{
                            $translate("清空")
                    }}</el-button>
                    <el-button type="primary" size="mini" @click="issueCommand" :disabled="btnParams.isDisable">{{
                            btnParams.issueBtnText
                    }}</el-button>
                </div>
            </template>
            <template #content>
                <div style="margin: 10px 0">
                    <el-select :placeholder="$translate('充放电')" size="small" v-model="type" style="width: 113px"
                        class="margin-l" clearable>
                        <el-option :label="$translate('待机')" value="0"> </el-option>
                        <el-option :label="$translate('充电时段')" value="1"> </el-option>
                        <el-option :label="$translate('放电时段')" value="2"> </el-option>
                    </el-select>
                    <el-time-picker style="margin: 0px 10px" is-range v-model="timeValue" range-separator="--"
                        :start-placeholder="$translate('开始时间')" :end-placeholder="$translate('结束时间')"
                        placeholder="选择时间范围" format="'HH:mm" value-format="HH:mm" size="small" fixed>
                    </el-time-picker>
                    <!-- <el-select :placeholder="$translate('尖峰平谷电价设置')" size="small" v-model="typeElc" style="width: 160px"
                        class="margin-l" clearable>
                        <el-option :la      bel="$translate('尖')" value="尖"> </el-option>
                        <el-option :label="$translate('峰')" value="峰"> </el-option>
                        <el-option :label="$translate('平')" value="平"> </el-option>
                        <el-option :label="$translate('谷')" value="谷"> </el-option>
                    </el-select> -->
                </div>
                <div class="wrapper">
                    <el-table :data="chargeDischargeGaps" style="width: 100%">
                        <el-table-column prop="status" :label="$translate('充放电')">
                        </el-table-column>
                        <el-table-column prop='timeRange' :label="$translate('开始时间') + '--' + $translate('结束时间')">
                        </el-table-column>
                        <!-- <el-table-column prop="typeElc" :label="$translate('尖峰平谷电价设置')">
                        </el-table-column> -->
                    </el-table>
                </div>
            </template>
        </CommandPlane>
    </div>
</template>

<script>
import { showMessage } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "TwoMinute",
    data() {
        return {
            isWrite: "",
            type: "",
            start: "",
            end: "",
            chargeDischargeGaps: [],
            timeValue: ["08:00", "08:00"],
            typeElc: "",
        };
    },
    props: {
        btnParams: {
            type: Object,
            default: (_) => { },
        },
    },
    components: {
        CommandPlane: (_) => import("../components/CommandPlane"),
        PlaneBox: (_) => import("@/components/PlaneBox"),
    },
    methods: {
        add() {
            console.log(this.timeValue);
            if (!this.type) {
                return showMessage(
                    "warning",
                    // this.$translate("请选择状态")
                    "请选择状态"
                );
            }
            if (!this.timeValue[0]) {
                return showMessage(
                    "warning",
                    this.$translate("请选择开始时间")
                );
            }
            if (!this.timeValue[1]) {
                return showMessage(
                    "warning",
                    this.$translate("请选择结束时间")
                );
            }
            let timeRange = this.timeValue[0].concat('--', this.timeValue[1])
            let status = { '0': this.$translate('待机'), '1': this.$translate('充电时段'), '2': this.$translate('放电时段') }
            // let typeElcStatus = { '0': this.$translate('尖'), '1': this.$translate('峰'), '2': this.$translate('平'), '3': this.$translate('谷') }

            this.chargeDischargeGaps.push({
                type: this.type,
                status: status[this.type],
                // startHour,
                // startMin,
                // endHour,
                // endMin,
                // typeElc: typeElcStatus[this.typeElc],
                // typeElc: this.typeElc,
                timeRange,
                startTime: this.timeValue[0],
                endTime: this.timeValue[1],
            });
            this.type = "";
            this.start = "";
            this.end = "";
            showMessage(
                "success",
                this.$translate("添加成功")
            );
        },
        clear() {
            this.$confirm(
                this.$translate("确认清空"),
                this.$translate("系统提示"),
                {
                    confirmButtonText: this.$translate("确定"),
                    cancelButtonText: this.$translate("取消"),
                    type: "warning",
                }
            ).then(async (_) => {
                this.chargeDischargeGaps = [];
            });
        },
        async readCommand() {
            this.$emit("issueCommand", {
                requestData: {
                    isWrite: false,
                },
                topic: "zhongz/timeSeg",
            });
        },
        issueCommand() {
            if (!this.chargeDischargeGaps.length) {
                return showMessage("warning", this.$translate("未添加时间段"));
            }
            this.$emit("issueCommand", {
                requestData: {
                    isWrite: true,
                    chargeDischargeGaps: JSON.stringify(
                        this.chargeDischargeGaps
                    ),
                },
                confirmParams: [
                    {
                        label: this.$translate("充放电时间段"),
                        value: JSON.stringify(this.chargeDischargeGaps),
                    },
                ],
                topic: "zhongz/timeSeg",
            });
        },
    },
    computed: {
        ...device_getters(["currentDevice"]),
    },
    watch: {
        result(newVal) {
            if (newVal.cmdTypeId == 3002) {
                this.chargeDischargeGaps = JSON.parse(
                    newVal.chargeDischargeGaps
                );
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.wrapper {
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
}
</style>
