<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("当前执行指令") }}</span>
            <el-button
                plain
                size="mini"
                @click="readCommand"
                :disabled="btnParams.isDisable"
                >{{ btnParams.readBtnText }}</el-button
            >
        </template>
        <div slot="content">
            <div class="div-checkbox">
                <el-checkbox
                    v-for="(item, index) in checkboxList"
                    :key="index"
                    disabled
                    v-model="item.check"
                >
                    {{ $translate(item.label) }}</el-checkbox
                >
            </div>
            <div v-for="(item, index) in params" :key="index" class="item">
                <span>{{ $translate(item.label) }}：</span>
                <el-input
                    size="small"
                    type="text"
                    v-model="item.value"
                    autocomplete="off"
                ></el-input>
            </div>
        </div>
    </CommandPlane>
</template>

<script>
import { apiCurrentInstruction } from "@/api/command";
import { showMessage } from "@/common/utils";
export default {
    name: "CurrentInstruction",
    data() {
        return {
            checkboxList: [
                { label: "指令使能状态", check: false, key: "enable" },
                { label: "并网状态", check: false, key: "onOffGrid" },
                { label: "防逆流功能", check: false, key: "antiReflux" },
                { label: "需量控制", check: false, key: "demandControl" },
                {
                    label: "无功功率控制",
                    check: false,
                    key: "reactivePowerEnable",
                },
            ],
            params: [
                {
                    label: "CMD_SN",
                    key: "cmdSn",
                    value: "",
                },
                {
                    label: "有功功率",
                    key: "activePowerPercent",
                    value: "",
                },
                {
                    label: "无功功率",
                    key: "reactivePower",
                    value: "",
                },
                {
                    label: "运行时间",
                    key: "runTime",
                    value: "",
                },
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
            this.$emit("readCommand", apiCurrentInstruction);
        },
    },
    watch: {
        result(newVal) {
            if (newVal.cmdTypeId === 1030) {
                this.checkboxList.forEach(
                    (v) => (v.check = Boolean(newVal[v.key]))
                );
                this.params.forEach((item) => {
                    item.value = newVal[item.key];
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.item {
    @include dis-flex(flex-start, center);
    width: 25%;
    margin-bottom: 20px;
    .el-input,
    .el-select {
        width: calc(100% - 150px);
    }
}
.div-checkbox {
    width: 100%;
    margin-bottom: 20px;
}
</style>
