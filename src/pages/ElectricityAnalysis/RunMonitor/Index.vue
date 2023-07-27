<template>
    <div class="runMonitor">
        <div class="search-wrapper">
            <div>
                <span class="search-name">
                    {{ $translate("监测点名称") }}：</span
                >
                <el-select v-model="monitorPoint" size="mini">
                    <el-option
                        v-for="item in monitorPointList"
                        :key="item.value"
                        :label="$translate(item.label)"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </div>
            <div>
                <span class="search-name"> {{ $translate("数据项") }}：</span>
                <el-select v-model="dataValue" size="mini">
                    <el-option
                        v-for="item in dataList"
                        :key="item.value"
                        :label="$translate(item.label)"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </div>
            <div>
                <span class="search-name"> {{ $translate("对比日期") }}：</span>
                <el-date-picker
                    v-model="date"
                    type="date"
                    size="mini"
                    :editable="false"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </div>
            <el-button type="primary" size="mini" @click="handleSearch">
                {{ $translate("查询") }}</el-button
            >
            <ExportExcel
                :header="getExcelParams.header"
                :title="getExcelParams.title"
                :fields="getExcelParams.fields"
                :data="excelData"
            />
        </div>
        <PlaneBox>
            <span slot="title"> {{ $translate("运行监测") }}</span>
            <TimeChart :args="chartArgs" slot="content" />
        </PlaneBox>
        <Table :columns="columns" :tableData="tableData" />
    </div>
</template>

<script>
import { apiGetMeterChartData } from "@/api/device";
import { runMonitor_dataList } from "@/common/config";
import {
    nowTime,
    getEchatsData,
    momentFormate,
    makeSameDate,
    getOtherDate,
} from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");

export default {
    name: "RunMonitor",
    data() {
        return {
            monitorPoint: 1,
            monitorPointList: [
                { label: "电表监测", value: 1 },
                { label: "PCS监测", value: 0 },
            ],
            dataValue: "125_154_kW",
            dataList: runMonitor_dataList,
            date: nowTime(-1, "YYYY-MM-DD"),
            tableData: [],
            columns: [
                {
                    key: "time",
                    label: "时间",
                    formatter: ({ time }) => momentFormate(time, "YYYY-MM-DD"),
                },
                { key: "MaxValue", label: "最大值" },
                {
                    key: "MaxValueTime",
                    label: "最大值时间",
                    formatter: ({ MaxValueTime }) =>
                        momentFormate(MaxValueTime, "HH:mm:ss"),
                },
                { key: "MinValue", label: "最小值" },
                {
                    key: "MinValueTime",
                    label: "最小值时间",
                    formatter: ({ MinValueTime }) =>
                        momentFormate(MinValueTime, "HH:mm:ss"),
                },
                { key: "AvgValue", label: "平均值" },
            ],
            chartArgs: {
                ref: "runMonitor",
                options: {
                    yAxis: {
                        name: "kW",
                    },
                    series: [
                        { name: this.$translate("对比日期"), data: [] },
                        { name: this.$translate("今日"), data: [] },
                    ],
                },
            },
            excelData: [],
        };
    },
    mounted() {
        this.handleSearch();
    },
    computed: {
        ...device_getters(["currentDevice"]),
        getExcelParams() {
            let monitorName = this.monitorPointList.find(
                (item) => item.value == this.monitorPoint
            ).label;
            let dataType = this.dataList.find(
                (item) => item.value == this.dataValue
            ).label;
            return {
                header: `${this.currentDevice.sn}-pcs-${dataType}/${
                    this.dataValue.split("_")[2]
                }`,
                title: `${this.currentDevice.sn}-${monitorName}-${dataType}`,
                fields: {
                    [this.$translate("时间")]: "time",
                    [nowTime(0, "YYYY-MM-DD")]: "今日",
                    [this.date]: "对比日期",
                },
            };
        },
    },
    components: {
        Table: (_) => import("@/components/Table"),
        PlaneBox: (_) => import("@/components/PlaneBox"),
        TimeChart: (_) => import("@/components/Chart/TimeChart"),
        ExportExcel: (_) => import("@/components/ExportExcel"),
    },
    methods: {
        handleSearch() {
            this.chartArgs.options.yAxis.name = this.dataValue.split("_")[2];
            this.getChartsData();
        },
        async getChartsData() {
            this.excelData = [];
            let requestData = {
                dtuId: this.currentDevice.id,
                dataType: this.dataValue.split("_")[this.monitorPoint],
                compareDate: this.date,
            };
            let { data } = await apiGetMeterChartData(requestData);
            data = JSON.parse(data || "{}");
            let { nowDatas, compareDatas, nowMaxMinAvg, compareMaxMinAvg } =
                data;
            this.chartArgs.options.series[0].data = getEchatsData(
                compareDatas || []
            );
            this.chartArgs.options.series[1].data = getEchatsData(
                makeSameDate(nowDatas, compareDatas) || []
            );
            this.formatterExcelData();
            this.initTable(nowMaxMinAvg, compareMaxMinAvg);
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
                        dataItem[_uuIndex === 0 ? "对比日期" : "今日"] = value;
                        dataItem = {
                            ...dataItem,
                        };
                    });
                    arr.push(dataItem);
                });
                this.excelData = arr;
            }
        },
        initTable(nowMaxMinAvg, compareMaxMinAvg) {
            this.tableData = [];
            if (nowMaxMinAvg) {
                this.tableData.push({
                    time: nowMaxMinAvg.max.time,
                    MaxValue: nowMaxMinAvg.max.value,
                    MaxValueTime: nowMaxMinAvg.max.time,
                    MinValue: nowMaxMinAvg.min.value,
                    MinValueTime: nowMaxMinAvg.min.time,
                    AvgValue: nowMaxMinAvg.avg,
                });
            }
            if (compareMaxMinAvg) {
                this.tableData.push({
                    time: compareMaxMinAvg.max.time,
                    MaxValue: compareMaxMinAvg.max.value,
                    MaxValueTime: compareMaxMinAvg.max.time,
                    MinValue: compareMaxMinAvg.min.value,
                    MinValueTime: compareMaxMinAvg.min.time,
                    AvgValue: compareMaxMinAvg.avg,
                });
            }
        },
    },
};
</script>
