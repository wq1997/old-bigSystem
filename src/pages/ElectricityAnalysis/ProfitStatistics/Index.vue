<template>
    <div class="profitStatistics">
        <div class="search-wrapper">
            <div>
                <span class="search-name">{{ $translate("查询日期") }}：</span>
                <DatePick
                    :defaultDate="date"
                    type="date"
                    :disabledDate="disabledDate"
                    @change="changeDate"
                ></DatePick>
            </div>
            <el-button type="primary" size="mini" @click="getChartsData">{{
                $translate("查询")
            }}</el-button
            ><ExportExcel
                :header="getExcelParams.header"
                :title="getExcelParams.title"
                :fields="getExcelParams.fields"
                :data="excelData"
            />
        </div>
        <div class="card-wrapper">
            <div v-for="(item, index) in cardData" :key="index">
                <span class="name"> {{ $translate(item.name) }}：</span>
                <div>
                    <span class="value">{{ item.value }}</span>
                    <span v-if="index == 0 || index == 3">{{
                        $translate(item.unit)
                    }}</span>
                    <span v-else>{{ item.unit }}</span>
                </div>
            </div>
        </div>
        <PlaneBox>
            <span slot="title">{{ $translate("储能节省电费") }}</span>
            <CategoryChart :args="chartArgs" slot="content" />
        </PlaneBox>
    </div>
</template>

<script>
import { nowTime, momentFormate } from "@/common/utils";
import { apiGetProfitStatistics } from "@/api/device";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "ProfitStatistics",
    data() {
        return {
            date: nowTime(0, "YYYY-MM-DD"),
            disabledDate: {
                disabledDate(time) {
                    const startDate = new Date();
                    const endDate = new Date();
                    startDate.setTime(startDate.getTime() - 3600 * 1000 * 24 * 15);
                    endDate.setTime(endDate.getTime() + 3600 * 1000 * 24 * 15);
                    return time.getTime() < startDate || time.getTime()>endDate;
                },
            },
            cardData: [
                {
                    name: "本月平均收益",
                    value: "0.0",
                    unit: "元",
                    key: "avgFee",
                },
                {
                    name: "本月累计充电量",
                    value: "0.0",
                    unit: "kWh",
                    key: "daysCharge",
                },
                {
                    name: "本月累计放电量",
                    value: "0.0",
                    unit: "kWh",
                    key: "daysDisCharge",
                },
                {
                    name: "本月节省电费",
                    value: "0.0",
                    unit: "元",
                    key: "daysFee",
                },
            ],
            chartArgs: {
                ref: "profitStatistics",
                colorIndex: 0,
                options: {
                    xAxis: {
                        data: [],
                    },
                    yAxis: {
                        name: this.$translate("元"),
                    },
                    series: [
                        { name: this.$translate("储能节省电费"), data: [] },
                    ],
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
        CategoryChart: (_) => import("@/components/Chart/CategoryChart"),
        ExportExcel: (_) => import("@/components/ExportExcel"),
    },
    computed: {
        ...device_getters(["currentDevice","allDevices","version"]),
        getExcelParams() {
            return {
                header: `${this.currentDevice.sn}-储能节省电费/元`,
                title: "储能节省电费",
                fields: {
                    [this.$translate("日期")]: "date",
                    节省电费: "saveMoney",
                },
            };
        },
    },
    methods: {
        async getChartsData() {
            let requestData = {
                dtuId: this.version=='2'?this.allDevices[0].dtuId:this.currentDevice.id,
                startDate: this.date,
                endDate: this.date,
            };
            let { data } = await apiGetProfitStatistics(requestData);
            if (data) {
                let parseData = JSON.parse(data);
                let { data: chartData } = parseData;
                this.cardData.forEach(
                    (item) => (item.value = parseData[item.key])
                );
                let xData = [];
                let yData = [];
                chartData.forEach((item) => {
                    xData.push(momentFormate(item.date, "MM-DD"));
                    yData.push(item.fee);
                });
                this.chartArgs.options.xAxis.data = xData;
                this.chartArgs.options.series[0].data = yData;
                this.formatterExcelData();
            }
        },
        formatterExcelData() {
            this.excelData = [];
            let {
                xAxis,
                series: [{ data }],
            } = this.chartArgs.options;
            let arr = [];
            xAxis.data.forEach((date, index) => {
                arr.push({
                    date: date,
                    saveMoney: data[index],
                });
            });
            this.excelData = arr;
        },
        changeDate(value) {
            this.date = value;
        },
    },
    //  disabledDate = current => {
    //   // Can not select days before today and today
    //   return current && current < dayjs().endOf('day');
    // }
};
</script>

<style lang="scss" scoped>
.profitStatistics {
    .card-wrapper {
        height: 180px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 20px;
        padding: 10px;
        box-sizing: border-box;
        > div {
            border-radius: 5px;
            @include bg-color("2");
            @include dis-flex(center, center, column);
            padding: 10px;
            box-sizing: border-box;

            .name {
                margin-bottom: 10px;
            }
            .value {
                font-size: 35px;
                font-weight: bolder;
                margin-right: 5px;
                font-size: 45px;
                @include font-color("1");
                font-family: DINCondensed-Bold;
            }
        }
    }
}
</style>
