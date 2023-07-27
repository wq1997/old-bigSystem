<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("需量控制") }}</span>
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
import { apiDemandControl } from "@/api/command";
import { showMessage } from "@/common/utils";
export default {
    name: "DemandControl",
    data() {
        return {
            params: [
                {
                    label: "需量防逆流余量",
                    key: "demandAutiReflaxPower",
                    value: "",
                },
                {
                    label: "需量soc下限",
                    key: "demandCtrlSocLowLimt",
                    value: "",
                },
                {
                    label: "当前需量设置",
                    key: "demandCtrlSocLowLimt",
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
            this.$emit("readCommand", apiDemandControl);
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
            this.$emit("issueCommand", { requestData, topic: "ctlWrite" });
        },
    },
    watch: {
        result(newVal) {
            if (newVal.cmdTypeId === 1028) {
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
