<template>
    <div class="runMonitor">
        <div class="search-wrapper">
            <div>
                <span class="search-name">PCS：</span>
                <el-select v-model="monitorPoint" size="mini" placeholder="请选择" defaultValue="pcs">
                    <el-option v-if="version!='2'" label="pcs" :value="1">
                     </el-option>
                    
                    <el-option 
                    v-else 
                    v-for="item in pcsGroup" 
                    :key="item.value"
                    :label="item.label" 
                    :value="item.value"> </el-option>

                </el-select>
            </div>
            <div>
                <span class="search-name">{{ $translate("数据项") }}：</span>
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
                <span class="search-name">{{ $translate("对比日期") }}：</span>
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
            <el-button type="primary" size="mini" @click="handleSearch">{{
                $translate("查询")
            }}</el-button>
            <ExportExcel
                :header="getExcelParams.header"
                :title="getExcelParams.title"
                :fields="getExcelParams.fields"
           getEchatsData     :data="excelData"
            />
        </div>
        <PlaneBox>
            <span slot="title">{{ $translate("储能监测") }}</span>
            <TimeChart :args="chartArgs" slot="content" />
        </PlaneBox>
        <Table :columns="columns" :tableData="tableData" />
    </div>
</template>

<script>
import { apiGetEnergyMonitor,apiGetNewEnergyPcsHistory,apiGetNewPCSCount } from "@/api/device";
import { energyMonitor_dataList } from "@/common/config";
import {
    nowTime,
    getEchatsData,
    momentFormate,
    makeSameDate,
} from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "EnergyMonitor",
    data() {
        return {
            monitorPoint: 1,
            pcsGroup:[],
            dataValue: "169_kW",
            dataList: energyMonitor_dataList,
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
                ref: "energyMonitor",
                options: {
                    yAxis: {
                        name: "kw",
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
        this.getSelectData();
    },
    computed: {
        ...device_getters(["currentDevice","version","PCS"]),
        getExcelParams() {
            let dataType = this.dataList.find(
                (item) => item.value == this.dataValue
            ).label;
            return {
                header: `${this.currentDevice.sn}-pcs-${dataType}/${
                    this.dataValue.split("_")[1]
                }`,
                title: `${this.currentDevice.sn}-pcs-${dataType}`,
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
            this.chartArgs.options.yAxis.name = this.dataValue.split("_")[1];
            this.getChartsData();
        },
        async getChartsData() {
            let requestData = {
            };
            if (this.version=='2') {
                requestData = {
                containerId: sessionStorage.getItem('containerId'),
                dataType: this.dataValue.split("_")[0],
                pcsIdx:this.monitorPoint-1,
                compareDate: this.date,
            }; 
            }else{
                requestData = {
                dtuId: this.currentDevice.id,
                dataType: this.dataValue.split("_")[0],
                compareDate: this.date,
            }; 
            }

            let { data } = await (this.version=='2'?apiGetNewEnergyPcsHistory(requestData):apiGetEnergyMonitor(requestData));
            data = JSON.parse(data || "[]");
            let { nowDatas, compareDatas, nowMaxMinAvg, compareMaxMinAvg } =
                data;
            console.log(nowMaxMinAvg,compareMaxMinAvg);
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
            console.log(nowMaxMinAvg,compareMaxMinAvg);
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
            console.log(this.tableData);
            }
        },
        async getSelectData(){
            if (this.version=="2") {
                if (this.PCS) {
                    for (let i = 1; i <=this.PCS.length; i++) {
                     let pcslab=`${i}#PCS`;
                    this.pcsGroup.push({
                        value:i,
                        label:pcslab
                    })
                    }
                }
            }
        }
    },
};
</script>
