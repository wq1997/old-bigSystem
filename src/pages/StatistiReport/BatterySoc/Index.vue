<template>
    <div class="batterySoc">
        <div class="search-wrapper">
            <div>
                <span class="search-name">{{ $translate("日期") }}：</span>
                <DatePick
                    :defaultDate="date"
                    type="date"
                    @change="changeDate"
                ></DatePick>
            </div>
            <el-button type="primary" size="mini" @click="getChartsData">{{
                $translate("查询")
            }}</el-button>
            <ExportExcel
                :header="getExcelParams.header"
                :title="getExcelParams.title"
                :fields="getExcelParams.fields"
                :data="excelData"
            />
        </div>
        <PlaneBox>
            <span slot="title">{{ $translate("电池组SOC曲线") }}</span>
            <TimeChart :args="chartArgs" slot="content" />
        </PlaneBox>
    </div>
</template>

<script>
import { nowTime, momentFormate, getEchatsData } from "@/common/utils";
import { apiBatterySocChart } from "@/api/device";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "BatterySoc",
    data() {
        return {
            date: nowTime(0, "YYYY-MM-DD"),
            chartArgs: {
                ref: "batterySoc",
                colorIndex: 0,
                options: {
                    yAxis: {
                        name: "%",
                    },
                    series: [],
                },
            },
            excelData: [],
        };
    },
    mounted() {
        this.getChartsData();
    },
    components: {
        DatePick: (_) => import("@/components/DatePick"),
        PlaneBox: (_) => import("@/components/PlaneBox"),
        TimeChart: (_) => import("@/components/Chart/TimeChart"),
        ExportExcel: (_) => import("@/components/ExportExcel"),
    },
    computed: {
        ...device_getters(["currentDevice"]),
        getExcelParams() {
            let { series: seriesData } = this.chartArgs.options;
            let batteryObj = {};
            seriesData.forEach(
                (item, index) =>
                    (batteryObj[`${index + 1}#电池组`] = `${index + 1}#电池组`)
            );
            return {
                header: `${this.currentDevice.sn}-${this.date}-电池组SOC/%`,
                title: "电池组SOC",
                fields: {
                    [this.$translate("时间")]: "time",
                    ...batteryObj,
                },
            };
        },
    },
    methods: {
        async getChartsData() {
            this.chartArgs.options.series = [];
            let requestData = {
                dtuId: this.currentDevice.id,
                date: this.date,
            };
            let { data } = await apiBatterySocChart(requestData);
            let chartData = JSON.parse(data || "[]");
            Object.values(chartData).forEach((item, index) => {
                this.chartArgs.options.series.push({
                    name: `${index + 1}#${this.$translate("电池组")}`,
                    data: item ? getEchatsData(item) : [],
                });
            });
            this.formatterExcelData();
        },
        formatterExcelData() {
            this.excelData = [];
            let { series: seriesData } = this.chartArgs.options;
            if (seriesData.length && seriesData[0].data) {
                let arr = [];
                seriesData[0].data.forEach((item, index) => {
                    let dataItem = {};
                    seriesData.forEach(({ name, data }, _uuIndex) => {
                        let [time, value] = data[index]["value"];
                        dataItem.time = momentFormate(time, "HH:mm");
                        dataItem[`${_uuIndex + 1}#电池组`] = value;
                        dataItem = {
                            ...dataItem,
                        };
                    });
                    arr.push(dataItem);
                });
                this.excelData = arr.sort((a, b) => b.time - a.time);
            }
        },
        changeDate(value) {
            this.date = value;
        },
    },
};
</script>
