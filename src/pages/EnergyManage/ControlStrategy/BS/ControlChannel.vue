<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("控制通告执行指令") }}</span>
            <div>
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
            <div v-for="(item, index) in params" :key="index" class="item">
                <span>{{ $translate(item.label) }}：</span>
                <el-select
                    size="small"
                    v-model="item.value"
                    v-if="item.type === 'select'"
                >
                    <el-option
                        v-for="uu in item.options"
                        :key="uu.value"
                        :label="$translate(uu.label)"
                        :value="uu.value"
                    >
                    </el-option>
                </el-select>
                <el-input
                    v-else
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
import { apiControlChannel } from "@/api/command";
import { showMessage } from "@/common/utils";
export default {
    name: "ControlChannel",
    data() {
        return {
            params: [
                {
                    label: "运行模式",
                    type: "select",
                    options: [
                        {
                            value: 0,
                            label: "待机",
                        },
                        {
                            value: 1,
                            label: "恒功率充电",
                        },
                        {
                            value: 2,
                            label: "恒功率放电",
                        },
                        {
                            value: 3,
                            label: "离网",
                        },
                        {
                            value: 4,
                            label: "执行start[0]命令",
                        },
                        {
                            value: 5,
                            label: "执行start[1]命令",
                        },
                        {
                            value: 6,
                            label: "执行CMD_Manger调度",
                        },
                        {
                            value: 7,
                            label: "执行CMD_Auto指令",
                        },
                        {
                            value: 8,
                            label: "执行发电侧限制控制",
                        },
                        {
                            value: 9,
                            label: "执行发电侧限制控制",
                        },
                        {
                            value: 10,
                            label: "soc重新激活",
                        },
                        {
                            value: 11,
                            label: "电量重新计算",
                        },
                        {
                            value: 12,
                            label: "复位指令",
                        },
                        {
                            value: 13,
                            label: "低功耗指令",
                        },
                    ],
                    key: "runMode",
                    value: "",
                },
                {
                    label: "指令运行时间",
                    type: "input",
                    key: "systemRunTime",
                    value: "",
                },
                {
                    label: "有功功率百分比",
                    type: "input",
                    key: "systemPcsActivePower",
                    value: "",
                },
                {
                    label: "无功功率百分比",
                    type: "input",
                    key: "systemPcsReactivePower",
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
            this.$emit("readCommand", apiControlChannel);
        },
        issueCommand() {
            let requestData = {};
            this.params.forEach(({ key, value }) => (requestData[key] = value));
            if (Object.values(requestData).includes("")) {
                return showMessage(
                    "warning",
                    this.$translate("请填写全部字段")
                );
            }
            this.$emit("issueCommand", { requestData, topic: "commandWrite" });
        },
    },
    watch: {
        result(newVal) {
            if (newVal.cmdTypeId === 1029) {
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
</style>
