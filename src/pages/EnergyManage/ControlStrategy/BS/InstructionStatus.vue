<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("指令状态") }}</span>
            <el-button
                plain
                size="mini"
                @click="readCommand"
                :disabled="btnParams.isDisable"
                >{{ btnParams.readBtnText }}</el-button
            >
        </template>
        <div slot="content">
            <el-checkbox
                v-for="(item, index) in checkboxList"
                :key="index"
                disabled
                v-model="item.check"
                >{{ $translate(item.label) }}</el-checkbox
            >
        </div>
    </CommandPlane>
</template>

<script>
import { apiInstructionStatus } from "@/api/command";
import { showMessage } from "@/common/utils";
export default {
    name: "InstructionStatus",
    data() {
        return {
            checkboxList: [
                { label: "硬件并联指令", check: false, key: "0" },
                { label: "系统维护指令", check: false, key: "1" },
                { label: "预留指令", check: false, key: "2" },
                { label: "硬件执行指令", check: false, key: "3" },
                { label: "LCD执行指令", check: false, key: "4" },
                { label: "绿色通道执行指令", check: false, key: "5" },
                { label: "控制通道执行指令", check: false, key: "6" },
                { label: "预留指令1", check: false, key: "7" },
                { label: "预留指令2", check: false, key: "8" },
                { label: "预留指令3", check: false, key: "9" },
                { label: "开机运行指令", check: false, key: "10" },
                { label: "预留控制指令1", check: false, key: "11" },
                { label: "预留控制指令2", check: false, key: "12" },
                { label: "预留控制指令3", check: false, key: "13" },
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
            this.$emit("readCommand", apiInstructionStatus);
        },
    },
    watch: {
        result(newVal) {
            if (newVal.cmdTypeId === 1031) {
                this.checkboxList.forEach(
                    (v) => (v.check = Boolean(newVal.cmdStates[v.key]))
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
