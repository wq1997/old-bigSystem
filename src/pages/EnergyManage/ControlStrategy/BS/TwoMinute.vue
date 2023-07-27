<template>
    <div>
        <CommandPlane>
            <template #title>
                <span>{{ $translate("两分钟控制测略") }}</span>
                <div>
                    <el-button
                        type="success"
                        size="mini"
                        @click="add"
                        :disabled="btnParams.isDisable"
                        >{{ $translate("添加") }}</el-button
                    >
                    <el-button
                        type="danger"
                        size="mini"
                        @click="clear"
                        :disabled="btnParams.isDisable"
                        >{{ $translate("清空") }}</el-button
                    >
                    <el-button
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
            <template #content>
                <div>
                    <el-checkbox
                        v-for="(item, index) in checkboxList"
                        :key="index"
                        v-model="item.check"
                        >{{ item.label }}</el-checkbox
                    >
                </div>
                <div style="margin: 10px 0">
                    <el-select
                        placeholder="指令序列"
                        size="small"
                        v-model="cmd"
                        style="width: 113px"
                        class="margin-l"
                        clearable
                    >
                        <el-option
                            v-for="uu in instructionList"
                            :key="uu.value"
                            :label="uu.desc"
                            :value="uu.value"
                        >
                        </el-option>
                    </el-select>
                    <el-time-select
                        class="margin-lr"
                        style="width: 113px"
                        :placeholder="$translate('开始时间')"
                        v-model="start"
                        size="small"
                        :picker-options="{
                            start: '00:00',
                            step: '00:02',
                            end: '24:00',
                            minTime: getStartMinTime,
                            maxTime: end,
                        }"
                    >
                    </el-time-select>

                    <!-- 结束时间 -->
                    <el-time-select
                        style="width: 113px"
                        :placeholder="$translate('结束时间')"
                        size="small"
                        v-model="end"
                        :picker-options="{
                            start: '00:00',
                            step: '00:02',
                            end: '24:00',
                            minTime: start,
                        }"
                    >
                    </el-time-select>

                    <el-input
                        class="margin-lr"
                        style="width: 120px"
                        size="small"
                        type="text"
                        v-model="activePowerPercent"
                        :placeholder="$translate('有功功率')"
                        autocomplete="off"
                    ></el-input>

                    <el-input
                        style="width: 120px"
                        size="small"
                        type="text"
                        v-model="reactivePowerPercent"
                        :placeholder="$translate('无功功率')"
                        autocomplete="off"
                    ></el-input>
                </div>
                <div class="wrapper">
                    <ul class="realTime">
                        <li v-for="(item, index) in times" :key="item">
                            <span v-if="!(index % 3)">{{ item }}</span>
                            <span v-if="index === 23">24:00</span>
                        </li>
                    </ul>
                    <div class="price-block">
                        <el-tooltip
                            v-for="(item, index) in issueData"
                            :key="index"
                            class="item"
                            effect="dark"
                            :content="item.start + '~' + item.end"
                            placement="bottom-start"
                        >
                            <div :style="getStyle(item, index)">
                                {{ item.start + "~" + item.end }}
                            </div>
                        </el-tooltip>
                    </div>
                </div>
            </template>
        </CommandPlane>
    </div>
</template>

<script>
import {
    momentFormate,
    showMessage,
    getHoursBetweenTime,
    getRandomColor,
} from "@/common/utils";
import { apiGetIndexKeywords, apiGetTwoMinute } from "@/api/command";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
import moment from "moment";
export default {
    name: "TwoMinute",
    data() {
        return {
            times: [
                "00:00",
                "01:00",
                "02:00",
                "03:00",
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
                "23:00",
            ],
            checkboxList: [
                { label: "指令使能位", check: false, key: "enable" },
                { label: "并网 0，离网1", check: false, key: "onOffGrid" },
                { label: "防逆流功能使能位", check: false, key: "antiReflux" },
                { label: "需量控制使能位", check: false, key: "demandControl" },
                {
                    label: "无功功率控制使能位",
                    check: false,
                    key: "reactivePower",
                },
            ],
            instructionList: [
                // { label: "上电", value: 0 },
                // { label: "待机", value: 1 },
                // { label: "低功耗", value: 2 },
                // { label: "复位", value: 3 },
                // { label: "运行", value: 4 }
            ],
            start: "",
            end: "",
            cmd: "",
            activePowerPercent: "",
            reactivePowerPercent: "",
            issueData: [],
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
        PlaneBox: (_) => import("@/components/PlaneBox"),
    },
    async mounted() {
        let { data } = await apiGetIndexKeywords({ code: "E" });
        this.instructionList = data;
    },
    methods: {
        add() {
            if (!this.start) {
                return showMessage("warning", "请选择开始时间");
            }
            if (!this.end) {
                return showMessage("warning", "请选择结束时间");
            }
            let itemData = {
                start: this.start,
                end: this.end,
                cmd: this.cmd,
                activePowerPercent: this.activePowerPercent,
                reactivePowerPercent: this.reactivePowerPercent,
                cmd: this.cmd,
            };
            this.checkboxList.forEach((item) => {
                itemData[item.key] = item.check;
            });
            this.issueData.push(itemData);
            this.start = "";
            this.end = "";
        },
        clear() {
            this.$confirm(
                this.$translate("确认清空"),
                this.$translate("系统提示"),
                {
                    confirmButtonText: this.$translate("确定"),
                    cancelButtonText: this.$translate("取消"),
                    type: "warning",
                }
            ).then(async (_) => {
                this.issueData = [];
            });
        },
        async readCommand() {
            let { data } = await apiGetTwoMinute({
                dtuId: this.currentDevice.id,
            });
            if (data) {
                this.issueData = data;
            }
        },
        issueCommand() {
            if (!this.issueData.length) {
                return showMessage("warning", "未添加时间段");
            }
            this.$emit("issueCommand", {
                requestData: {
                    strategy: this.issueData,
                },
                topic: "mCtlStrategy",
            });
        },
    },
    computed: {
        ...device_getters(["currentDevice"]),
        getStartMinTime() {
            let length = this.issueData.length;
            if (length) {
                let min = this.issueData[length - 1].end;
                let [hour, minute] = min.split(":");
                return `${hour}:${minute - 2}`;
            } else {
                return "";
            }
        },
        getStyle() {
            return ({ start, end }, index) => {
                let zeroPoint = moment(
                    `2020-01-08 00:00`,
                    "YYYY-MM-DD HH:mm:ss"
                );
                let st = moment(
                    `2020-01-08 ${start}:00`,
                    "YYYY-MM-DD HH:mm:ss"
                );
                let et = moment(`2020-01-08 ${end}:00`, "YYYY-MM-DD HH:mm:ss");
                let width = 4.16 * getHoursBetweenTime(st, et);
                let marginLeft = 4.16 * getHoursBetweenTime(zeroPoint, st);
                return {
                    padding: "0 7px",
                    borderRadius: "3px",
                    boxSizing: "border-box",
                    width: `${width}%`,
                    marginLeft: `${marginLeft}%`,
                    background: getRandomColor(index),
                };
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.wrapper {
    padding: 30px;
    border-radius: 5px;
    box-sizing: border-box;
    @include bg-color("1");
    display: inline-block !important;
    width: 100%;
    .realTime {
        display: flex;
        margin-bottom: 10px;
        li {
            flex: 1;
            height: 10px;
            position: relative;
            list-style: none;
            border-left: 1px solid #999;
            border-bottom: 1px solid #999;
            span {
                position: absolute;
                top: -19px;
                font-size: 12px;
                font-weight: bolder;
                @include font-color("2");
            }
            &:not(:last-child) {
                span {
                    left: -16px;
                }
            }
            &:last-child {
                border-right: 1px solid #999;
                span {
                    right: -16px;
                }
            }
        }
    }
    .price-block {
        div {
            height: 32px;
            line-height: 32px;
            color: #fff;
            font-size: 10px;
        }
    }
}
</style>
