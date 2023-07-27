<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("日控制测略") }}</span>
            <el-button
                type="primary"
                size="mini"
                @click="issueCommand"
                :disabled="btnParams.isDisable"
                >{{ btnParams.issueBtnText }}</el-button
            >
        </template>
        <div slot="content">
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
import { showMessage } from "@/common/utils";
export default {
    name: "DailyContral",
    data() {
        return {
            params: [
                {
                    label: "年",
                    key: "year",
                    value: "",
                },
                {
                    label: "月",
                    key: "month",
                    value: "",
                },
                {
                    label: "日",
                    key: "day",
                    value: "",
                },
                {
                    label: "星期",
                    key: "weekday",
                    value: "",
                },
                {
                    label: "时",
                    key: "hour",
                    value: "",
                },
                {
                    label: "分",
                    key: "minute",
                    value: "",
                },
                {
                    label: "秒",
                    key: "second",
                    value: "",
                },
                {
                    label: "RunModel",
                    key: "sysRunMode",
                    value: "",
                },
                {
                    label: "Enable",
                    key: "sysCommandEnabled",
                    value: "",
                },
                {
                    label: "CMD",
                    key: "sysCommand",
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
    },
    components: {
        CommandPlane: (_) => import("../components/CommandPlane"),
    },
    methods: {
        issueCommand() {
            let requestData = {};
            this.params.forEach(({ key, value }) => (requestData[key] = value));
            if (Object.values(requestData).includes("")) {
                return showMessage(
                    "warning",
                    this.$translate("请填写全部字段")
                );
            }
            this.$emit("issueCommand", {
                requestData,
                topic: "dayCtlStrategy",
            });
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
