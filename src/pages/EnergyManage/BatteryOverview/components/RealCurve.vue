<template>
    <div class="realCurve">
        <PlaneBox>
            <span slot="title">{{ $translate("电池最大最小电压总览") }}</span>
            <CategoryChart :args="volChartArgs" slot="content" />
        </PlaneBox>
        <PlaneBox>
            <span slot="title">{{ $translate("电池最高最低温度总览") }}</span>
            <CategoryChart :args="tempChartArgs" slot="content" />
        </PlaneBox>
    </div>
</template>

<script>
import { apiGetRealCurve,apiGetMaxMinValtage } from "@/api/device";
import { momentFormate } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "RealCurve",
    data() {
        return {
            volChartArgs: {
                ref: "volChartArgs",
                options: {
                    tooltip: {
                        formatter: (params) =>
                            this.getTooltip(
                                params,
                                this.$translate("最大电压")
                            ),
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 0,
                            end: 20,
                        },
                    ],
                    xAxis: {
                        data: [],
                        axisLabel: {
                            formatter: function (params) {
                                return params.split("-")[0];
                            },
                        },
                    },
                    yAxis: {
                        name: "V",
                    },
                    series: [
                        { name: this.$translate("最大电压"), data: [] },
                        { name: this.$translate("最小电压"), data: [] },
                    ],
                },
            },
            tempChartArgs: {
                ref: "tempChartArgs",
                options: {
                    tooltip: {
                        formatter: (params) =>
                            this.getTooltip(
                                params,
                                this.$translate("最高温度")
                            ),
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 0,
                            end: 20,
                        },
                    ],
                    xAxis: {
                        data: [],
                        axisLabel: {
                            formatter: function (params) {
                                return params.split("-")[0];
                            },
                        },
                    },
                    yAxis: {
                        name: "℃",
                    },
                    series: [
                        { name: this.$translate("最高温度"), data: [] },
                        { name: this.$translate("最低温度"), data: [] },
                    ],
                },
            },
        };
    },
    mounted() {
        this.getChartsData();
    },
    computed: {
        ...device_getters(["currentDevice","version"]),
    },
    components: {
        Table: (_) => import("@/components/Table"),
        PlaneBox: (_) => import("@/components/PlaneBox"),
        CategoryChart: (_) => import("@/components/Chart/CategoryChart"),
    },
    methods: {
        getTooltip(params, name) {
            let { axisValue } = params[0];
            let [, maxBsu, minBsu] = axisValue.split("-");
            let text = `${axisValue.split("-")[0]}<br/>`;
            params.forEach(({ seriesName, value, color }) => {
                let bsu = seriesName === name ? maxBsu : minBsu;
                text = text.concat(`
              <div>
              <span style="background:${color};width:10px;height:10px;border-radius:50%;display:inline-block"></span>
              ${seriesName}：${value}  ${bsu} <br/>
              </div>
              `);
            });
            return text;
        },
        async getChartsData() {
            let requestData ={}
            if(this.version=='2'){
                requestData={
                    containerId: sessionStorage.getItem('containerId'),
                }
            }else{
                requestData = {
                dtuId: this.currentDevice.id,
            };
            }
             
            let { data } = await (this.version=='2'?apiGetMaxMinValtage(requestData):apiGetRealCurve(requestData));
            if (data) {
                let parseData = JSON.parse(data);
                let [volxData, maxVol, minVol, tmpxData, maxTemp, minTemp] = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                ];
                parseData.forEach((item) => {
                    volxData.push(
                        `${this.$translate("第")}${item.group}${this.$translate(
                            "组"
                        )}Pack${item.cluster}-${this.$translate("第")}${
                            item.maxValtageBsu
                        }${this.$translate("节")}-${this.$translate("第")}${
                            item.minValtageBsu
                        }${this.$translate("节")}`
                    );
                    tmpxData.push(
                        `${this.$translate("第")}${item.group}${this.$translate(
                            "组"
                        )}Pack${item.cluster}-${this.$translate("第")}${
                            item.maxTemprtBsu
                        }${this.$translate("节")}-${this.$translate("第")}${
                            item.minTemprtBsu
                        }${this.$translate("节")}`
                    );
                    maxVol.push(item.maxValtage);
                    minVol.push(item.minValtage);
                    maxTemp.push(item.maxTemprt);
                    minTemp.push(item.minTemprt);
                });
                this.volChartArgs.options.xAxis.data = volxData;
                this.volChartArgs.options.series[0].data = maxVol;
                this.volChartArgs.options.series[1].data = minVol;
                this.tempChartArgs.options.xAxis.data = tmpxData;
                this.tempChartArgs.options.series[0].data = maxTemp;
                this.tempChartArgs.options.series[1].data = minTemp;
            }
        },
    },
};
</script>
