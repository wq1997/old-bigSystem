<template>
    <CommandPlane>
        <template #title>
            <span>{{ $translate("逆变器开关机设置") }}</span>
            <div>
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
            <div class="item">
                <div class="label">{{ $translate("逆变器开关机") }}</div>
                <el-select size="small" v-model="mode">
                    <el-option
                        v-for="uu in options"
                        :key="uu.value"
                        :label="$translate(uu.label)"
                        :value="uu.value"
                    >
                    </el-option>
                </el-select>
            </div>
        </div>
    </CommandPlane>
</template>

<script>
import { showMessage } from "@/common/utils";
export default {
    name: "SwitchMachine",
    data() {
        return {
            options: [
                {
                    value: 2,
                    label: "开机",
                },
                {
                    value: 3,
                    label: "关机",
                },
            ],
            mode: "",
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
        issueCommand() {
            let requestData = { mode: this.mode };
            if (Object.values(requestData).includes("")) {
                return showMessage(
                    "warning",
                    this.$translate("请填写全部字段")
                );
            }
            this.$emit("issueCommand", {
                requestData: {
                    isWrite: true,
                    ...requestData,
                },
                confirmParams: [
                    {
                        label: this.$translate("逆变器开关机"),
                        value:
                            this.mode == 2
                                ? this.$translate("开机")
                                : this.$translate("关机"),
                    },
                ],
                topic: "zhongz/startStop",
            });
        },
    },
    watch: {
        result(newVal) {
            // if (newVal.cmdTypeId == 1029) {
            //     this.params.forEach((item) => {
            //         item.value = newVal[item.key];
            //     });
            // }
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
