<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("尖峰平谷电价设置") }} </span>
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
                <div class="label">
                    {{ $translate(item.label) }} (/{{ $translate("元") }})
                </div>
                <el-input
                    size="small"
                    type="number"
                    v-model="item.value"
                    autocomplete="off"
                    validate-event
                ></el-input>
            </div>
        </div>
    </CommandPlane>
</template>

<script>
import { showMessage } from "@/common/utils";
export default {
    name: "ControlChannel",
    data() {
        return {
            params: [
                {
                    label: "尖",
                    type: "input",
                    key: "sharp",
                    value: "",
                },
                {
                    label: "峰",
                    type: "input",
                    key: "peak",
                    value: "",
                },
                {
                    label: "平",
                    type: "input",
                    key: "flat",
                    value: "",
                },
                {
                    label: "谷",
                    type: "input",
                    key: "bottom",
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
            this.$emit("issueCommand", {
                requestData: {
                    isWrite: false,
                },
                topic: "zhongz/elePrice",
            });
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
            let checkValueAvailable = true;
            for (let item of Object.values(requestData)) {
                if (isNaN(Number(item)) || item > 2 || item < 0) {
                    checkValueAvailable = false;
                    showMessage(
                        "warning",
                        this.$translate("请设置范围在") + " [0,2]"
                    );
                    break;
                }
            }
            if (!checkValueAvailable) return;
            this.$emit("issueCommand", {
                requestData: {
                    isWrite: true,
                    ...requestData,
                },
                confirmParams: this.params,
                topic: "zhongz/elePrice",
            });
        },
    },
    watch: {
        result(newVal) {
            if (newVal.cmdTypeId == 3003) {
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
    @include dis-flex(flex-end);
    width: 25%;
    margin-bottom: 20px;
    .label {
        width: 100px;
        text-align: right;
        margin-right: 8px;
    }
    .el-input,
    .el-select {
        width: calc(100% - 120px);
    }
}
</style>
