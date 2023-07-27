<template>
    <div class="profitDetail">
        <div class="search-wrapper">
            <div>
                <span class="search-name">{{ $translate("查询日期") }}：</span>
                <DatePick
                    :defaultDate="date"
                    type="daterange"
                    @change="changeDate"
                ></DatePick>
            </div>
            <el-button type="primary" size="mini" @click="getData">{{
                $translate("查询")
            }}</el-button
            ><ExportExcel
                :header="getExcelParams.header"
                :title="getExcelParams.title"
                :fields="getExcelParams.fields"
                :data="excelData"
            />
        </div>
        <PlaneBox>
            <span slot="title">{{ $translate("充电放电电量统计") }}</span>
            <div style="margin: 0 10px" slot="content">
                <el-table
                    :data="tableData"
                    :max-height="tableHeight"
                    v-loading="loading"
                    element-loading-text="...loading"
                    element-loading-spinner="el-icon-loading"
                >
                    <el-table-column
                        v-for="item in columns"
                        :key="item.key"
                        :prop="item.key"
                        :label="$translate(item.label) + item.unit"
                        :formatter="item.formatter"
                        align="center"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                </el-table>
            </div>
        </PlaneBox>
    </div>
</template>

<script>
import { nowTime, momentFormate } from "@/common/utils";
import { apiGetProfitDetail } from "@/api/device";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "ProfitDetail",
    data() {
        return {
            tableHeight: document.documentElement.clientHeight - 200,
            date: [nowTime(-7, "YYYY-MM-DD"), nowTime(0, "YYYY-MM-DD")],
            loading: false,
            columns: [
                {
                    key: "date",
                    label: "日期",
                    unit: "",
                    formatter: ({ date }) => momentFormate(date, "YYYY-MM-DD"),
                },
                { key: "sumCharge", label: "充电电量", unit: "/kWh" },
                { key: "charge1", label: "尖时段充电电量", unit: "/kWh" },
                { key: "charge2", label: "峰时段充电电量", unit: "/kWh" },
                { key: "charge3", label: "平时段充电电量", unit: "/kWh" },
                { key: "charge4", label: "谷时段充电电量", unit: "/kWh" },
                { key: "sumDisCharge", label: "放电电量", unit: "/kWh" },
                { key: "disCharge1", label: "尖时段放电电量", unit: "/kWh" },
                { key: "disCharge2", label: "峰时段放电电量", unit: "/kWh" },
                { key: "disCharge3", label: "平时段放电电量", unit: "/kWh" },
                { key: "disCharge4", label: "谷时段放电电量", unit: "/kWh" },
                { key: "fee", label: "当天收益", unit: "元" },
                {
                    key: "effect",
                    label: "当天充放电比率",
                    unit: "",
                    formatter: ({ effect }) =>
                        effect != -1
                            ? effect
                            : this.$translate("数据有误,不做效率计算"),
                },
            ],
            tableData: [],
            excelData: [],
        };
    },
    mounted() {
        this.getData();
    },
    components: {
        DatePick: (_) => import("@/components/DatePick"),
        Table: (_) => import("@/components/Table"),
        PlaneBox: (_) => import("@/components/PlaneBox"),
        ExportExcel: (_) => import("@/components/ExportExcel"),
    },
    computed: {
        ...device_getters(["currentDevice","version","allDevices"]),
        getExcelParams() {
            return {
                header: `${this.currentDevice.sn}-收益统计`,
                title: "电量统计",
                fields: {
                    [this.$translate("日期")]: "date",
                    "充电电量/kWh": "sumCharge",
                    "尖时段充电电量/kWh": "charge1",
                    "峰时段充电电量/kWh": "charge2",
                    "平时段充电电量/kWh": "charge3",
                    "谷时段充电电量/kWh": "charge4",
                    "放电电量/kWh": "sumDisCharge",
                    "尖时段放电电量/kWh": "disCharge1",
                    "峰时段放电电量/kWh": "disCharge2",
                    "平时段放电电量/kWh": "disCharge3",
                    "谷时段放电电量/kWh": "disCharge4",
                    "当天收益/元": "fee",
                    "当天充放电比率": "effect",
                },
            };
        },
    },
    methods: {
        renderHeader(createElement, { column, _self }) {
            const label = column.label;
            const labelArr = label.split(" ");
            return createElement(
                "span", //创建最外层的标签可随意
                [
                    createElement(
                        "span",
                        {
                            // 创建第一个元素的标签可随意
                            attrs: { type: "text" },
                        },
                        [labelArr[0]]
                    ),
                    createElement(
                        "p",
                        {
                            // 创建第二个元素的标签可随意
                            attrs: { type: "text", style: "font-size:12px" }, // 给分割的某个元素单独加样式
                        },
                        [labelArr[1] || ""]
                    ),
                ]
            );
        },
        changeDate(value) {
            this.date = value;
        },
        async getData() {
            this.loading = true;
            let requestData = {
                dtuId: this.version=='2'?this.allDevices[0].dtuId:this.currentDevice.id,
                sDate: this.date[0],
                eDate: this.date[1],
            };
            let { data } = await apiGetProfitDetail(requestData);
            this.loading = false;
            this.tableData = JSON.parse(data || "[]");
            this.formatterExcelData();
        },
        formatterExcelData() {
            console.log( this.tableData);
            this.excelData = [];
            let arr = [];
            this.tableData.forEach((item) => {
                arr.push({
                    date: momentFormate(item.date, "YYYY-MM-DD"),
                    sumCharge: item.sumCharge,
                    charge1: item.charge1,
                    charge2: item.charge2,
                    charge3: item.charge3,
                    charge4: item.charge4,
                    sumDisCharge: item.sumDisCharge,
                    disCharge1: item.disCharge1,
                    disCharge2: item.disCharge2,
                    disCharge3: item.disCharge3,
                    disCharge4: item.disCharge4,
                    fee: item.fee,
                    effect:
                        item.effect != -1
                            ? item.effect
                            : this.$translate("数据有误,不做效率计算"),
                });
            });
            this.excelData = arr;
        },
    },
};
</script>
