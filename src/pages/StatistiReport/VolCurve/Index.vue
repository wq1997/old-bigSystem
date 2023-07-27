<template>
    <div class="volCurve">
        <div class="search-wrapper">
            <div>
                <span class="search-name">{{ $translate("电池组") }}：</span>
                <el-cascader size="mini" v-model="value" :options="batteryGroup" :props="{ expandTrigger: 'hover' }">
                </el-cascader>
            </div>
            <div>
                <span class="search-name">{{ $translate("对比日期") }}：</span>
                <el-date-picker v-model="date" type="date" size="mini" :editable="false" :clearable="false"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
            <el-button type="primary" size="mini" @click="handleSearch">{{
            $translate("查询")
            }}</el-button>
            <ExportExcel :title="excel_title" :fields="excel_fields" :data="resData" />
        </div>
        <PlaneBox>
            <span slot="title">{{ $translate("压差曲线") }}</span>
            <TimeChart :args="chartArgs" slot="content" />
        </PlaneBox>
    </div>
</template>

<script>
import { apiGetBatteryCount, apiVolCurve, apiGetContainerCellCount,apiGetBattClusterMaxVolDiff } from "@/api/device";
import { nowTime, momentFormate } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "VolCurve",
    data() {
        return {
            value: [1, 1],
            batteryGroup: [],
            date: nowTime(-1, "YYYY-MM-DD"),
            chartArgs: {
                ref: "runMonitor",
                options: {
                    tooltip: {
                        formatter: (params) => this.getTooltip(params),
                    },
                    yAxis: {
                        name: "V",
                    },
                    series: [
                        { name: this.$translate("对比日期"), data: [] },
                        { name: this.$translate("今日"), data: [] },
                    ],
                },
            },
            resData: [],
            excel_title: "压差曲线",
            excel_fields: {
                sn: {
                    field: "dtuId",
                    callback: (value) => this.currentDevice.sn,
                },
                压差: "nowDiff",
                最大电压: "nowMax",
                最大电压单体: "nowMaxCell",
                最小电压: "nowMin",
                最小电压单体: "nowMinCell",
                时间: {
                    field: "nowTime",
                    callback: (value) =>
                        momentFormate(
                            parseInt(value) * 1000,
                            "YYYY-MM-DD HH:mm:ss"
                        ),
                },
            },
        };
    },
    mounted() {
        this.getBatteryCount();
        this.handleSearch();

    },
    computed: {
        ...device_getters(["currentDevice", "version"]),
    },
    components: {
        PlaneBox: (_) => import("@/components/PlaneBox"),
        ExportExcel: (_) => import("@/components/ExportExcel"),
        TimeChart: (_) => import("@/components/Chart/TimeChart"),
    },
    methods: {
        getTooltip(params) {
            let text = "";
            params.forEach(({ seriesName, dataIndex, seriesIndex, color }) => {
                let {
                    nowDiff,
                    nowMax,
                    nowMin,
                    nowMaxCell,
                    nowMinCell,
                    cmpDiff,
                    cmpMax,
                    cmpMin,
                    cmpMaxCell,
                    cmpMinCell,
                } = this.resData[dataIndex];
                let [value, max, min, maxCell, minCell] = ["", "", "", "", ""];
                if (seriesIndex === 0) {
                    value = cmpDiff;
                    max = cmpMax;
                    min = cmpMin;
                    maxCell = cmpMaxCell;
                    minCell = cmpMinCell;
                } else {
                    value = nowDiff;
                    max = nowMax;
                    min = nowMin;
                    maxCell = nowMaxCell;
                    minCell = nowMinCell;
                }

                text = text.concat(`
              <div>
                <span style="background:${color};width:10px;height:10px;border-radius:50%;display:inline-block"></span>
                ${seriesName}：${value} <br/>
                ${this.$translate("最大电压")}：${max} (${this.$translate(
                    "第"
                )}${maxCell}${this.$translate("节")})<br/>
                ${this.$translate("最小电压")}：${min} (${this.$translate(
                    "第"
                )}${minCell}${this.$translate("节")})<br/>
                </div>
              `);
            });
            return text;
        },
        handleSearch() {
            this.getChartsData();
        },
        async getContainerCellCount() {
            this.value=["1,1",1];

            let { data } = await apiGetContainerCellCount({
                containerId: sessionStorage.getItem("containerId"),
            });
            if (data) {
                for (let i = 1; i <= data.length; i++) {
                    for (let j = 1; j <= +data[i - 1]; j++) {
                        let heapNum = `${this.$translate("第")}${i}${this.$translate("堆")}${j}#${this.$translate("电池组")}`;
                        let cluster = [];
                    for (let k = 1; k <= 32; k++) {
                        cluster.push({ 
                            label: `Pack ${k} `,
                            value: k,
                        });
                    }
                        this.batteryGroup.push({
                            label: heapNum,
                            value: i + ',' + j,
                            children: cluster,

                        });
                    }
                }
            }
        },
        async getBatteryCount() {
            if (this.version == "2") {
                this.getContainerCellCount();
                return;
            }
            let { data: count } = await apiGetBatteryCount({
                dtuId: this.currentDevice.id,
            });
            if (count) {
                for (let i = 1; i <= count; i++) {
                    let group = i + `#${this.$translate("电池组")}`;
                    let cluster = [];
                    for (let j = 1; j <= 32; j++) {
                        cluster.push({
                            label: `Pack ${j} `,
                            value: j,
                        });
                    }
                    this.batteryGroup.push({
                        label: group,
                        value: i,
                        children: cluster,
                    });
                }
            }
        },
        async getChartsData() {
        let requestData={};
            if (this.version=='2') {
                 requestData = {
                 containerId: sessionStorage.getItem('containerId'),
                 bmsIdx: this.value[0].split(',')[0]-1,
                 bmcIdx: this.value[0].split(',')[1]-1,
                 packIdx:this.value[1]-1,
                date: this.date,
            };
            }else{
                 requestData = {
                dtuId: this.currentDevice.id,
                group: this.value[0],
                cluster: this.value[1],
                date: this.date,
            };
            }
           
            let { data } = await (this.version=='2'?apiGetBattClusterMaxVolDiff(requestData):apiVolCurve(requestData));
            this.resData = JSON.parse(data || "[]");
            let nowData = [];
            let compareData = [];
            this.resData.forEach(({ nowTime, nowDiff, cmpDiff }) => {
                let time = momentFormate(
                    parseInt(nowTime) * 1000,
                    "YYYY-MM-DD HH:mm:ss"
                );
                nowData.push({
                    time,
                    value: [time, nowDiff],
                });
                compareData.push({
                    time,
                    value: [time, cmpDiff],
                });
            });
            this.chartArgs.options.series[0].data = compareData;
            this.chartArgs.options.series[1].data = nowData;
        },
    },
};
</script>
