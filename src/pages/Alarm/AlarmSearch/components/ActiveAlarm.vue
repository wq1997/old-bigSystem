<template>
    <div class="active-alarm">
        <div class="table-wrapper">
            <Table
                :columns="columns"
                :tableData="tableData"
                :loading="loading"
            />
        </div>
        <div class="pagination-wrapper">
            <Pagination
                :total="tableData.length"
                :pageSize="pageSize"
                @e_changePage="e_changePage"
            />
        </div>
    </div>
</template>

<script>
import { apiGetAppNowAlarmsWithPage,apiGetNowAlarmsByContainerIdWithPage } from "@/api/alarm";
import { nowTime } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
const { mapActions: user_actions } = createNamespacedHelpers("user");
export default {
    name: "ActiveAlarm",
    data() {
        return {
            loading: false,
            start: nowTime(-7, "YYYY-MM-DD"),
            end: nowTime(0, "YYYY-MM-DD"),
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
            ],
            tableData: [],
            currentPage: 1,
            pageSize: 30,
            total: 0,
        };
    },
    mounted() {
        this.getAlarmData();
        this.getActiveCount();
    },
    components: {
        Table: (_) => import("@/components/Table"),
        Pagination: (_) => import("@/components/Pagination"),
    },
    computed: {
        ...device_getters(["currentDevice","version"]),
        alarmPrior1Class() {
            return "alarm-prior1";
        },
    },
    methods: {
        ...user_actions(["getActiveCount"]),
        async getAlarmData() {
            this.loading = true;
            let requestData={};

            if (this.version=='2') {
                requestData = {
                containerId:sessionStorage.getItem("containerId"),
                currentPage: this.currentPage,
                pageSize: this.pageSize,
            };
            }else{
                requestData = {
                dtuId: this.currentDevice.id,
                start: this.start,
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                end: this.end,
            };
            }
           
            let { data } = await(this.version=='2'?apiGetNowAlarmsByContainerIdWithPage(requestData):apiGetAppNowAlarmsWithPage(requestData));
            let { list, total } = data;
            this.tableData = list;
            this.total = total;
            this.loading = false;
        },
        e_changePage(page) {
            this.currentPage = page;
            this.getAlarmData();
        },
    },
};
</script>

<style lang="scss" scoped>
.active-alarm {
    .alarm-icon {
        margin-right: 5px;
    }
    .pagination-wrapper {
        text-align: right;
        margin-top: 20px;
    }
}
</style>
