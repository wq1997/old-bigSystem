-+++<template>
    <div class="history-alarm">
        <div class="search-wrapper">
            <div>
                <span class="search-name">{{ $translate("查询日期") }}：</span>
                <el-date-picker v-model="timeValue" type="daterange" range-separator="--"
                    :start-placeholder="$translate('开始日期')" :end-placeholder="$translate('结束日期')" size="mini"
                    format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>

            <el-button size="mini" type="primary" @click="handleSearch">
                {{ $translate("查询") }}
            </el-button>
            <ExportExcel :title="excel_title" :fields="excel_fields" :data="tableData" />
        </div>
        <div class="table-wrapper">
            <Table :columns="columns" :tableData="tableData" :loading="loading" />
        </div>
        <div class="pagination-wrapper">
            <Pagination :total="total" :pageSize="pageSize" @e_changePage="e_changePage" />
        </div>
    </div>
</template>

<script>
import { apiGetHistoryAlarm,apiGetAlarmsByContainerIdWithPage } from "@/api/alarm";
import { nowTime, getEchatsData, momentFormate } from "@/common/utils";
import { dayTypes, tooltipStyle, colorList } from "@/common/config";
import { apiGetPowerCurve, apiGetPvCurve, apiGetSocCurve } from "@/api/device";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");

export default {
    name: "HistoryAlarm",
    data() {
        return {
            loading: false,
            // start: nowTime(-7, "YYYY-MM-DD"),
            // end: nowTime(0, "YYYY-MM-DD"),
            timeValue: [nowTime(-7, "YYYY-MM-DD"), nowTime(0, "YYYY-MM-DD")],
            columns: [
                { key: "deviceName", label: "设备名称" },
                { key: "signalName", label: "信号名称" },
                {
                    key: "prior",
                    label: "报警等级",
                    formatter: ({ prior }) => {
                        let alarmIcon; // 这里面不能绑定class 所以用if else
                        if (prior === 1) {
                            alarmIcon = (
                                <i class="iconfont icon-shouye-tongyong- alarm-icon alarm-prior1"></i>
                            );
                        } else if (prior === 1) {
                            alarmIcon = (
                                <i class="iconfont icon-shouye-tongyong- alarm-icon alarm-prior2"></i>
                            );
                        } else {
                            alarmIcon = (
                                <i class="iconfont icon-shouye-tongyong- alarm-icon alarm-prior3"></i>
                            );
                        }
                        return (
                            <span>
                                {alarmIcon}
                                {prior}
                                {this.$translate("级警告")}
                            </span>
                        );
                    },
                },
                { key: "desc", label: "报警描述" },
                {
                    key: "beginS",
                    label: "开始时间",
                },
                {
                    key: "endS",
                    label: "结束时间",
                },
            ],
            tableData: [],
            currentPage: 1,
            pageSize: 30,
            total: 0,
            excel_title: this.$translate("历史报警"),
            excel_fields: {
                sn: {
                    field: "dtuId",
                    callback: (value) => this.currentDevice.sn,
                },
                [this.$translate("设备ID")]: "dtuId",
                [this.$translate("报警编号")]: "almId",
                [this.$translate("类型编号")]: "almTypeId",
                [this.$translate("信号名称")]: "signalName",
                [this.$translate("报警描述")]: "desc",
                [this.$translate("设备信号")]: "deviceName",
                [this.$translate("报警等级")]: "prior",
                [this.$translate("开始时间")]: "beginS",
                [this.$translate("结束时间")]: "endS",
            },
        };
    },
    mounted() {
        this.getAlarmData();
    },
    components: {
        Table: (_) => import("@/components/Table"),
        Pagination: (_) => import("@/components/Pagination"),
        ExportExcel: (_) => import("@/components/ExportExcel"),
    },
    computed: {
        ...device_getters(["currentDevice","version"]),
        alarmPrior1Class() {
            return "alarm-prior1";
        },
    },
    methods: {
        async getAlarmData() {
            this.loading = true;
            let requestData={};
            if (this.timeValue===null) {
                this.timeValue=[nowTime(-7, "YYYY-MM-DD"), nowTime(0, "YYYY-MM-DD")];
            }
            if (this.version=='2') {
                requestData = {
                containerId:sessionStorage.getItem("containerId"),
                start: this.timeValue[0],
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                end: this.timeValue[1],
            };
            }else{
                requestData = {
                dtuId: this.currentDevice.id,
                start: this.timeValue[0],
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                end: this.timeValue[1],
            };
            }
            let { data } = await (this.version=='2'?apiGetAlarmsByContainerIdWithPage(requestData):apiGetHistoryAlarm(requestData));
            let { list, total } = JSON.parse(data);
            this.tableData = list;
            this.total = total;
            this.loading = false;
        },
        e_changePage(page) {
            this.currentPage = page;
            this.getAlarmData();
        },
        handleSearch() {
            this.currentPage = 1;
            this.total = 0;
            this.getAlarmData();
        },
    },
};
</script>

<style lang="scss" scoped>
.history-alarm {
    .alarm-icon {
        margin-right: 5px;
    }

    .pagination-wrapper {
        text-align: right;
        margin-top: 20px;
    }
}
</style>
