<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("低功耗屏蔽") }}</span>
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
            <el-checkbox
                v-for="(item, index) in checkboxList"
                :key="index"
                v-model="item.check"
                >{{ index }} - {{ item.label }}</el-checkbox
            >
        </div>
    </CommandPlane>
</template>

<script>
import { apiLowPower } from "@/api/command";
import { showMessage } from "@/common/utils";
export default {
    name: "LowPower",
    data() {
        return {
            modeList: [{ value: 1, label: "调试模式" }],
            mode: 1,
            checkboxList: [
                { label: "硬件故障", check: false },
                { label: "开关关闭", check: false },
                { label: "无24V", check: false },
                { label: "通讯低功耗", check: false },
                { label: "电芯电压过低", check: false },
                { label: "SOC过低", check: false },
                { label: "电流长时间过低", check: false },
                { label: "长时间待机", check: false },
                { label: "无PCS", check: false },
                { label: "无外部3.3V", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
                { label: "预留", check: false },
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
            this.$emit("readCommand", apiLowPower);
        },
        issueCommand() {
            let faultFlags = [];
            this.checkboxList.forEach((v) => faultFlags.push(v.check ? 1 : 0));
            this.$emit("issueCommand", {
                requestData: { faultFlags },
                topic: "lowPowerWrite",
            });
        },
    },
    watch: {
        result(newVal) {
            let { cmdTypeId, faultFlags } = newVal;
            if (cmdTypeId === 2010) {
                faultFlags.forEach(
                    (v, index) =>
                        (this.checkboxList[index].check = v == 0 ? false : true)
                );
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
