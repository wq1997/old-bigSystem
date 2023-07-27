<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("故障屏蔽") }}</span>
            <div>
                <el-select v-model="mode" size="mini">
                    <el-option
                        v-for="item in modeList"
                        :key="item.value"
                        :label="$translate(item.label)"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
                <el-button
                    plain
                    size="mini"
                    @click="readCommand"
                    :disabled="btnParams.isDisable"
                    >{{ btnParams.readBtnText }}</el-button
                >
                <el-button
                    type="primary"
                    size="mini"
                    @click="issueCommand"
                    :disabled="btnParams.isDisable"
                    >{{ btnParams.issueBtnText }}</el-button
                >
            </div>
        </template>
        <div slot="content">
            <div>
                <el-checkbox
                    v-for="(item, index) in checkboxList1"
                    :key="index"
                    v-model="item.check"
                    >{{ index }} - {{ item.label }}</el-checkbox
                >
            </div>
            <div>
                <el-checkbox
                    v-for="(item, index) in checkboxList2"
                    :key="index"
                    v-model="item.check"
                    >{{ index }} - {{ item.label }}</el-checkbox
                >
            </div>
        </div>
    </CommandPlane>
</template>

<script>
import {
    apiFaultShielding_normal,
    apiFaultShielding_debug,
} from "@/api/command";
import { showMessage } from "@/common/utils";
export default {
    name: "FaultShielding",
    data() {
        return {
            modeList: [
                { value: 1, label: "正常模式" },
                { value: 2, label: "调试模式" },
            ],
            mode: 1,
            checkboxList1: [
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "24V状态", check: false },
                { label: "18650状态", check: false },
                { label: "开关状态", check: false },
                { label: "18650电量低", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "无24V", check: false },
                { label: "开关断开", check: false },
                { label: "无外部3.3V", check: false },
                { label: "TripErr", check: false },
                { label: "从机故障", check: false },
                { label: "采样压差大", check: false },
                { label: "预充电流过大", check: false },
                { label: "PreRelyErr", check: false },
                { label: "无PCS", check: false },
                { label: "输出电流过大", check: false },
                { label: "放电禁止放电电流高1", check: false },
                { label: "放电禁止放电电流高2", check: false },
                { label: "充电禁止充电电流高1", check: false },
                { label: "充电禁止充电电流高2", check: false },
                { label: "强制充电放电电流高1", check: false },
                { label: "强制充电放电电流高2", check: false },
            ],
            checkboxList2: [
                { label: "PCS故障", check: false },
                { label: "压差过大", check: false },
                { label: "温度板故障", check: false },
                { label: "霍尔故障", check: false },
                { label: "主接触器故障", check: false },
                { label: "串联电池故障", check: false },
                { label: "从接触器故障", check: false },
                { label: "绝缘故障", check: false },
                { label: "电压过高1", check: false },
                { label: "电压过低1", check: false },
                { label: "电芯温度高1", check: false },
                { label: "电芯温度低1", check: false },
                { label: "电流过高1", check: false },
                { label: "SOC过高1", check: false },
                { label: "SOC过低1", check: false },
                { label: "预留", check: false },
                { label: "电压过高2", check: false },
                { label: "电压过低2", check: false },
                { label: "电芯温度高2", check: false },
                { label: "电芯温度低2", check: false },
                { label: "电流过高2", check: false },
                { label: "SOC过高2", check: false },
                { label: "SOC过低2", check: false },
                { label: "预留", check: false },
                { label: "电压过高3", check: false },
                { label: "电压过低3", check: false },
                { label: "电芯温度高3", check: false },
                { label: "电芯温度低3", check: false },
                { label: "电流过高3", check: false },
                { label: "SOC过高3", check: false },
                { label: "SOC过低3", check: false },
                { label: "温度版告警", check: false },
            ],
        };
    },
    props: {
        btnParams: {
            type: Object,
            default: (_) => {},
        },
        result: {
            type: Object,
            default: (_) => {},
        },
    },
    components: {
        CommandPlane: (_) => import("../components/CommandPlane"),
    },
    methods: {
        readCommand() {
            this.$emit(
                "readCommand",
                this.mode === 1
                    ? apiFaultShielding_normal
                    : apiFaultShielding_debug
            );
        },
        issueCommand() {
            let faultFlags = [];
            this.checkboxList1.forEach((v) => faultFlags.push(v.check ? 1 : 0));
            this.checkboxList2.forEach((v) => faultFlags.push(v.check ? 1 : 0));
            this.$emit("issueCommand", {
                requestData: { faultFlags },
                topic: this.mode === 1 ? "bugWrite" : "debugWrite",
            });
        },
    },
    watch: {
        result(newVal) {
            let { cmdTypeId, faultFlags } = newVal;
            if (cmdTypeId === 2006) {
                faultFlags.forEach((v, index) => {
                    v = v == 0 ? false : true;
                    index <= 31
                        ? (this.checkboxList1[index].check = v)
                        : (this.checkboxList2[index - 32].check = v);
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.el-checkbox {
    margin-bottom: 20px;
}
</style>
