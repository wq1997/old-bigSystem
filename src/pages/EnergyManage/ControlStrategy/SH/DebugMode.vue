<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("调试模式") }}</span>
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
                    v-if="mode === 1"
                    plain
                    size="mini"
                    @click="readCommand"
                    :disabled="btnParams.isDisable"
                    >{{ btnParams.readBtnText }}</el-button
                >
                <el-button
                    v-else
                    type="primary"
                    size="mini"
                    @click="issueCommand"
                    :disabled="btnParams.isDisable"
                    >{{ btnParams.issueBtnText }}</el-button
                >
            </div>
        </template>
        <div slot="content">
            <template v-if="mode === 1">
                <div class="div-checkbox">
                    <el-checkbox
                        v-for="(item, index) in checkboxList"
                        :key="index"
                        v-model="item.check"
                        >{{ index }} - {{ $translate(item.label) }}</el-checkbox
                    >
                </div>
                <div class="item">
                    <span>{{ $translate("剩余时间") }}：</span>
                    <el-input
                        size="small"
                        type="text"
                        v-model="debugLeftTime"
                        autocomplete="off"
                    ></el-input>
                </div>
            </template>
            <div class="item" v-else>
                <span>{{ $translate("调试模式运行时间") }}：</span>
                <el-input
                    size="small"
                    type="text"
                    v-model="debugTime"
                    autocomplete="off"
                ></el-input>
            </div>
        </div>
    </CommandPlane>
</template>

<script>
import { apiDebugMode } from "@/api/command";
import { showMessage } from "@/common/utils";
export default {
    name: "DebugMode",
    data() {
        return {
            modeList: [
                { value: 1, label: "调试模式状态" },
                { value: 2, label: "通讯进入调试模式" },
            ],
            mode: 1,
            checkboxList: [
                {
                    label: "调试模式IO口状态",
                    key: "ioDebugState",
                    check: false,
                },
                { label: "调试模式IO口进入", key: "toDebug", check: false },
                { label: "调试模式通讯进入", key: "toDebugCom", check: false },
                { label: "调试模式状态", key: "model", check: false },
            ],
            debugLeftTime: "",
            debugTime: "",
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
            this.$emit("readCommand", apiDebugMode);
        },
        issueCommand() {
            if (this.debugTime === "") {
                return showMessage(
                    "warning",
                    this.$translate("请填写全部字段")
                );
            }
            this.$emit("issueCommand", {
                requestData: {
                    debugTime: this.debugTime,
                },
                topic: "settingWrite",
            });
        },
    },
    watch: {
        result(newVal) {
            if (newVal.cmdTypeId === 2004) {
                this.checkboxList.forEach(
                    (v) => (v.check = Boolean(newVal[v.key]))
                );
                this.debugLeftTime = newVal.debugLeftTime;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.div-checkbox {
    width: 100%;
    margin-bottom: 20px;
}
.item {
    @include dis-flex(flex-start, center);
    width: 25%;
    margin-bottom: 20px;
    .el-input,
    .el-select {
        width: calc(100% - 150px);
    }
}
</style>
