<template>
  <div class="monitorCurve">
    <div class="search-wrapper">
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
        <span class="search-name">{{ $translate("日期") }}：</span>
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
        :data="excelData"
      />
    </div>
    <PlaneBox>
      <span slot="title">{{ $translate("电池数据曲线") }}</span>
      <TimeChart :args="chartArgs" slot="content" />
    </PlaneBox>
  </div>
</template>

<script>
import { apiGetBatteryCure,apiGetNewAllBatteryCVS } from "@/api/device";
import { nowTime, getEchatsData, momentFormate } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
  name: "MonitorCurve",
  data() {
    return {
      dataValue: "192_V",
      dataList: [
        { value: "192_V", label: "电压" },
        { value: "193_A", label: "电流" },
        { value: "187_%", label: "SOC" },
        { value: "194_%", label: "SOH" }
      ],
      date: nowTime(0, "YYYY-MM-DD"),
      chartArgs: {
        ref: "batterySoc",
        colorIndex: 0,
        options: {
          yAxis: {
            name: "%"
          },
          series: []
        }
      },
      excelData: [],
      charsData:null
    };
  },
  mounted() {
    this.handleSearch();
  },
  computed: {
    ...device_getters(["currentDevice","version"]),
    getChartName() {
      return _ => {
        let { label } = this.dataList.find(
          item => item.value === this.dataValue
        );
        return this.$translate(label);
      };
    },
    getExcelParams() {
      let { label, value } = this.dataList.find(
        item => item.value == this.dataValue
      );
      console.log(this.dataList);
      let { series: seriesData } = this.chartArgs.options;
      console.log(seriesData);

      let batteryObj = {};
      seriesData.forEach(
        (item, index) =>
          (batteryObj[`${index + 1}#电池组`] = `${index + 1}#电池组`)
      );
      return {
        header: `${this.currentDevice.sn||sessionStorage.getItem('containId')}-${this.date}-电池组${label}/${
          value.split("_")[1]
        }`,
        title: `电池组${label}`,
        fields: {
          [this.$translate("时间")]: "time",
          ...batteryObj
        }
      };
    }
  },
  components: {
    Table: _ => import("@/components/Table"),
    PlaneBox: _ => import("@/components/PlaneBox"),
    TimeChart: _ => import("@/components/Chart/TimeChart"),
    ExportExcel: _ => import("@/components/ExportExcel")
  },
  methods: {
    handleSearch() {
      this.chartArgs.options.yAxis.name = this.dataValue.split("_")[1];
      this.getChartsData();
    },
    async getChartsData() {
      this.chartArgs.options.series = [];
      if (this.version=="2") {
        let requestData = {
        containerId: sessionStorage.getItem('containerId'),
        dataType: this.dataValue.split("_")[0],
        date: this.date
      };
      let { data } = await apiGetNewAllBatteryCVS(requestData);
      let keys = Object.keys(data).sort(
        (a, b) => +a.split("battery")[1] - +b.split("battery")[1]
      );
      if (data) {
        keys.forEach((key, index) => {
          this.chartArgs.options.series.push({
            name: `${+key.split("battery")[1] + 1}#${this.$translate(
              "电池组"
            )}`,
            data: data[key] ? getEchatsData(data[key]) : []
          });
        });
      }
      this.formatterExcelData();
      return;
      }
      let requestData = {
        dtuId: this.currentDevice.id,
        dataType: this.dataValue.split("_")[0],
        date: this.date
      };
      let { data } = await apiGetBatteryCure(requestData);
      let keys = Object.keys(data).sort(
        (a, b) => +a.split("battery")[1] - +b.split("battery")[1]
      );
      if (data) {
        keys.forEach((key, index) => {
          this.chartArgs.options.series.push({
            name: `${+key.split("battery")[1] + 1}#${this.$translate(
              "电池组"
            )}`,
            data: data[key] ? getEchatsData(data[key]) : []
          });
        });
      }
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
            console.log(seriesData);
            let [time, value] = data[index].value||[];
            dataItem.time = momentFormate(time, "HH:mm");
            dataItem[`${_uuIndex + 1}#电池组`] = value;
            dataItem = {
              ...dataItem
            };
          });
          arr.push(dataItem);
        });
        this.excelData = arr.sort((a, b) => b.time - a.time);
      }
    }
  }
};
</script>
