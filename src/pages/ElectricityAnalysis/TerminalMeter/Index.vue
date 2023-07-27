<template>
    <div class="terminalMeter">
        <div class="search-wrapper">
            <el-button
                v-for="item in btns"
                :key="item.value"
                :type="item.value === type ? 'primary' : ''"
                size="mini"
                @click="changeType(item.value)"
            >
                {{ $translate(item.label) }}
            </el-button>
            <el-dropdown size="mini">
                <el-button size="mini" type="warning" icon="el-icon-download"
                    >Excel
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <ExportExcel
                            :header="getExcelParams.chargeDischarge.header"
                            :title="getExcelParams.chargeDischarge.title"
                            :fields="getExcelParams.chargeDischarge.fields"
                            :data="chargeDischargeExcelData"
                            :buttonText="$translate('充放电曲线')"
                        /> </el-dropdown-item
                    ><el-dropdown-item>
                        <ExportExcel
                            :header="getExcelParams.charge.header"
                            :title="getExcelParams.charge.title"
                            :fields="getExcelParams.charge.fields"
                            :data="chargeExcelData"
                            :buttonText="$translate('充电统计')"
                        />
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <ExportExcel
                            :header="getExcelParams.discharge.header"
                            :title="getExcelParams.discharge.title"
                            :fields="getExcelParams.discharge.fields"
                            :data="dischargeExcelData"
                            :buttonText="$translate('放电统计')"
                        />
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <PlaneChart :args="chargeDischargeCurve"></PlaneChart>
        <PlaneChart :args="chargeStatistics"></PlaneChart>
        <PlaneChart :args="dischargeStatistics"></PlaneChart>
    </div>
</template>

<script>
import {
    apiChargeDisChargeCurve,
    apiChargeDisChargeMostValue,
    apiChargeStatistics,
    apiDisChargeStatistics,
} from "@/api/device";
import { getEchatsData, momentFormate, nowTime } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "TerminalMeter",
    data() {
        return {
            type: "1week",
            date: [nowTime(-7, "YYYY-MM-DD"), nowTime(0, "YYYY-MM-DD")],
            btns: [
                { label: "近1周", value: "1week" },
                { label: "近1月", value: "1month" },
                { label: "近3月", value: "3month" },
            ],
            chargeDischargeCurve: {
                title: "充放电曲线",
                ref: "chargeDischargeCurve",
                colorIndex: 0,
                options: {
                    yAxis: {
                        name: "kW",
                    },
                    series: [{ name: this.$translate("充放电"), data: [] }],
                },
                mostValue: [
                    { title: "实时充电功率", value: "", time: "", unit: "kW" },
                    { title: "最大充电功率", value: "", time: "", unit: "kW" },
                    { title: "最大放电功率", value: "", time: "", unit: "kW" },
                ],
            },
            chargeStatistics: {
                title: "充电统计",
                ref: "chargeStatistics",
                colorIndex: 1,
                options: {
                    xAxis: {
                        data: [],
                    },
                    yAxis: {
                        name: "kWh",
                    },
                    series: [{ name: this.$translate("充电电量"), data: [] }],
                },
                mostValue: [
                    {
                        title: "本日累计充电量",
                        value: "",
                        time: "",
                        unit: "kWh",
                    },
                    { title: "累计充电量", value: "", time: "", unit: "kWh" },
                ],
            },
            dischargeStatistics: {
                title: "放电统计",
                ref: "dischargeStatistics",
                colorIndex: 2,
                options: {
                    xAxis: {
                        data: [],
                    },
                    yAxis: {
                        name: "kWh",
                    },
                    series: [{ name: this.$translate("放电电量"), data: [] }],
                },
                mostValue: [
                    {
                        title: "本日累计放电量",
                        value: "",
                        time: "",
                        unit: "kWh",
                    },
                    { title: "累计放电量", value: "", time: "", unit: "kWh" },
                ],
            },
            chargeDischargeExcelData: [],
            chargeExcelData: [],
            dischargeExcelData: [],
        };
    },
    mounted() {
        this.getData();
    },
    components: {
        PlaneChart: (_) => import("./components/PlaneChart"),
        ExportExcel: (_) => import("@/components/ExportExcel"),
    },
    computed: {
        ...device_getters(["currentDevice","allDevices","version"]),
        getExcelParams() {
            return {
                chargeDischarge: {
                    header: `${this.currentDevice.sn}-充放电曲线/kW`,
                    title: "充放电曲线",
                    fields: {
                        [this.$translate("日期")]: {
                            field: "value",
                            callback: (value) => value[0],
                        },
                        [this.$translate("充放电")]: {
                            field: "value",
                            callback: (value) => value[1],
                        },
                    },
                },
                charge: {
                    header: `${this.currentDevice.sn}-充电统计/kWh`,
                    title: "充电统计",
                    fields: {
                        [this.$translate("日期")]: {
                            field: "time",
                            callback: (time) => momentFormate(time, "MM-DD"),
                        },
                        [this.$translate("充电")]: {
                            field: "value",
                            callback: (value) => value,
                        },
                    },
                },
                discharge: {
                    header: `${this.currentDevice.sn}-放电统计/kWh`,
                    title: "放电统计",
                    fields: {
                        [this.$translate("日期")]: {
                            field: "time",
                            callback: (time) => momentFormate(time, "MM-DD"),
                        },
                        [this.$translate("放电")]: {
                            field: "value",
                            callback: (value) => value,
                        },
                    },
                },
            };
        },
    },
    methods: {
        changeType(value) {
            this.type = value;
            this.getData();
        },
        getDateByDateType(){
            let newDate=[]
            let startDate = "";
            let lastDate = "";
            switch (this.type) {
                case "1week":
                    startDate = nowTime(-7, "YYYY-MM-DD");
                    lastDate = nowTime(0, "YYYY-MM-DD");
                    break;
                case "1month":
                    startDate = nowTime(-1, "YYYY-MM-DD", "months");
                    lastDate = nowTime(0, "YYYY-MM-DD");
                    break
                case "3month":
                    startDate = nowTime(-3, "YYYY-MM-DD", "months");
                    lastDate = nowTime(0, "YYYY-MM-DD");
                    break
                default:
                    break;
            }
            this.date=[startDate, lastDate]
        },
        getData() {
            this.getDateByDateType();
            let requestData = {
                dtuId: this.version=='2'?this.allDevices[0].dtuId:this.currentDevice.id,
                startDate: this.date[0],
                endDate: this.date[1],
            };
            this.getChargeDisChargeCurve(requestData);
            this.getChargeDisChargeMostValue(requestData);
            this.getChargeAmount(requestData);
            this.getDisChargeAmount(requestData);
        },
        async getChargeDisChargeCurve(requestData) {
            let { data } = await apiChargeDisChargeCurve(requestData);
            let prseData = JSON.parse(data || "[]");
            this.chargeDischargeCurve.options.series[0].data =
                getEchatsData(prseData);
            this.chargeDischargeExcelData = prseData;
        },
        async getChargeDisChargeMostValue(requestData) {
            let { data } = await apiChargeDisChargeMostValue(requestData);
            let {
                minMaxPower: {
                    maxCharge,
                    maxChargeTime,
                    maxDisCharge,
                    maxDisChargeTime,
                },
                lastPower: { value, time },
            } = JSON.parse(data);
            this.chargeDischargeCurve.mostValue[0].value = value;
            this.chargeDischargeCurve.mostValue[0].time = time;
            this.chargeDischargeCurve.mostValue[1].value = maxCharge;
            this.chargeDischargeCurve.mostValue[1].time = maxChargeTime;
            this.chargeDischargeCurve.mostValue[2].value = maxDisCharge;
            this.chargeDischargeCurve.mostValue[2].time = maxDisChargeTime;
        },
        async getChargeAmount(requestData) {
            let { data } = await apiChargeStatistics(requestData);
            let {
                sumCharge: { timeS, timeE, value },
                todayCharge: { time, value: tValue },
                chartData,
            } = JSON.parse(data);
            let xData = [];
            let yData = [];
            chartData.forEach((item) => {
                xData.push(momentFormate(item.time, "MM-DD"));
                yData.push(item.value);
            });
            this.chargeExcelData = chartData;
            this.chargeStatistics.options.xAxis.data = xData;
            this.chargeStatistics.options.series[0].data = yData;
            this.chargeStatistics.mostValue[0].value = tValue;
            this.chargeStatistics.mostValue[0].time = time;
            this.chargeStatistics.mostValue[1].value = value;
            this.chargeStatistics.mostValue[1].time = [timeS, timeE];
        },
        async getDisChargeAmount(requestData) {
            let { data } = await apiDisChargeStatistics(requestData);
            let {
                sumDisCharge: { timeS, timeE, value },
                todayDisCharge: { time, value: tValue },
                chartData,
            } = JSON.parse(data);
            let xData = [];
            let yData = [];
            chartData.forEach((item) => {
                xData.push(momentFormate(item.time, "MM-DD"));
                yData.push(item.value);
            });
            this.dischargeExcelData = chartData;
            this.dischargeStatistics.options.xAxis.data = xData;
            this.dischargeStatistics.options.series[0].data = yData;
            this.dischargeStatistics.mostValue[0].value = tValue;
            this.dischargeStatistics.mostValue[0].time = time;
            this.dischargeStatistics.mostValue[1].value = value;
            this.dischargeStatistics.mostValue[1].time = [timeS, timeE];
        },
    },
};
</script>

<style lang="scss" scoped>
.el-dropdown-menu--mini .el-dropdown-menu__item {
    padding: 3px;
    /deep/ .el-button {
        width: 100%;
        text-align: center;
    }
}
</style>