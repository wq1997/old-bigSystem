<template>
  <div class="profitStatistics">
    <div class="search-wrapper">
      <div>
        <span class="search-name">{{ $translate("查询日期") }}：</span>
        <DatePick
          :defaultDate="date"
          type="daterange"
          @change="changeDate"
        ></DatePick>
      </div>
      <el-button type="primary" size="mini" @click="getChartsData">{{
        $translate("查询")
      }}</el-button>
      <el-dropdown size="mini">
        <el-button size="mini" type="warning" icon="el-icon-download"
          >Excel
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <ExportExcel
              :header="getExcelParams.elecTotal.header"
              :title="getExcelParams.elecTotal.title"
              :fields="getExcelParams.elecTotal.fields"
              :data="elecTotalExcelData"
              :buttonText="$translate('电量统计')"
            /> </el-dropdown-item
          ><el-dropdown-item>
            <ExportExcel
              :header="getExcelParams.helpMeter.header"
              :title="getExcelParams.helpMeter.title"
              :fields="getExcelParams.helpMeter.fields"
              :data="helpMeterExcelData"
              :buttonText="$translate('辅源侧电表')"
            />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="card-wrapper">
      <div v-for="(item, index) in cardData" :key="index">
        <span class="name"> {{ $translate(item.name) }}：</span>
        <div>
          <span class="value">{{ item.value }}</span>
          <span>{{ item.unit }}</span>
        </div>
      </div>
    </div>
    <PlaneBox v-if="devicePermissions['N/A']||version=='2'">
      <span slot="title">{{ $translate("电量统计") }}</span>
      <CategoryChart :args="elecTotalOptions" slot="content" />
    </PlaneBox>
    <PlaneBox v-if="devicePermissions['N/B']">
      <span slot="title">{{ $translate("辅源侧电表") }}</span>
      <CategoryChart :args="helpMaterOptions" slot="content" />
    </PlaneBox>
  </div>
</template>

<script>
import { nowTime, momentFormate } from "@/common/utils";
import {
  apiGetElectricityStatistics,
  apiGetHelpMaterELecCure
} from "@/api/device";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
  name: "ElectricityStatistics",
  data() {
    return {
      date: [nowTime(-7, "YYYY-MM-DD"), nowTime(0, "YYYY-MM-DD")],
      cardData: [
        { name: "日充电效率", value: "-", unit: "%", key: "effect" },
        {
          name: "日充电量",
          value: "-",
          unit: "kWh",
          key: "daysCharge"
        },
        {
          name: "日放电量",
          value: "-",
          unit: "kWh",
          key: "daysDisCharge"
        }
      ],
      elecTotalOptions: {
        ref: "electricityStatistics",
        options: {
          xAxis: {
            data: []
          },
          yAxis: {
            name: "kWh"
          },
          series: [
            {
              name: this.$translate("充电尖"),
              key: "charge1",
              data: []
            },
            {
              name: this.$translate("充电峰"),
              key: "charge2",
              data: []
            },
            {
              name: this.$translate("充电平"),
              key: "charge3",
              data: []
            },
            {
              name: this.$translate("充电谷"),
              key: "charge4",
              data: []
            },
            {
              name: this.$translate("放电尖"),
              key: "disCharge1",
              data: []
            },
            {
              name: this.$translate("放电峰"),
              key: "disCharge2",
              data: []
            },
            {
              name: this.$translate("放电平"),
              key: "disCharge3",
              data: []
            },
            {
              name: this.$translate("放电谷"),
              key: "disCharge4",
              data: []
            }
          ]
        }
      },
      elecTotalExcelData: [],
      helpMaterOptions: {
        options: {
          xAxis: {
            data: []
          },
          yAxis: {
            name: "kWh"
          },
          series: [
            {
              name: this.$translate("用电量"),
              key: "charge1",
              data: []
            }
          ]
        }
      },
      helpMeterExcelData: []
    };
  },
  mounted() {
    this.getChartsData();
  },
  components: {
    DatePick: _ => import("@/components/DatePick"),
    PlaneBox: _ => import("@/components/PlaneBox"),
    CategoryChart: _ => import("@/components/Chart/CategoryChart"),
    ExportExcel: _ => import("@/components/ExportExcel")
  },
  computed: {
    ...device_getters(["currentDevice", "devicePermissions","version","allDevices"]),
    getExcelParams() {
      return {
        elecTotal: {
          header: `${this.currentDevice.sn}-电量统计/kWh`,
          title: "电量统计",
          fields: {
            [this.$translate("日期")]: "date",
            充电尖: "charge1",
            充电峰: "charge2",
            充电平: "charge3",
            充电谷: "charge4",
            放电尖: "disCharge1",
            放电峰: "disCharge2",
            放电平: "disCharge3",
            放电谷: "disCharge4"
          }
        },
        helpMeter: {
          header: `${this.currentDevice.sn}-辅源侧电表/kWh`,
          title: "辅源侧电表",
          fields: {
            [this.$translate("日期")]: {
              field: "time",
              callback: time => momentFormate(time, "MM-DD")
            },
            [this.$translate("用电量")]: {
              field: "value",
              callback: value => value
            }
          }
        }
      };
    }
  },
  methods: {
    async getChartsData() {
      this.getElecTotal();
      this.getHelpMaterELecCure();
    },
    formatterElecTotalExcelData(chartData) {
      this.elecTotalExcelData = [];
      let arr = [];
      chartData.forEach(item => {
        arr.push({
          date: momentFormate(item.date, "MM-DD"),
          charge1: item.charge1,
          charge2: item.charge2,
          charge3: item.charge3,
          charge4: item.charge4,
          disCharge1: item.disCharge1,
          disCharge2: item.disCharge2,
          disCharge3: item.disCharge3,
          disCharge4: item.disCharge4
        });
      });
      this.elecTotalExcelData = arr;
    },
    changeDate(value) {
      this.date = value;
    },
    async getElecTotal() {
      this.elecTotalOptions.options.xAxis.data = [];
      this.elecTotalOptions.options.series.forEach(uu => {
        uu.data = [];
      });
      this.formatterElecTotalExcelData([]);
      let requestData = {
        dtuId:this.version=='2'? this.allDevices[0].dtuId:this.currentDevice.id,
        sDate: this.date[0],
        eDate: this.date[1]
      };
      let { data } = await apiGetElectricityStatistics(requestData);
      if (data) {
        let parseData = JSON.parse(data);
        let { data: chartData } = parseData;
        this.cardData.forEach(item => (item.value = parseData[item.key]));
        if (chartData.length) {
          chartData.forEach(item => {
            this.elecTotalOptions.options.xAxis.data.push(
              momentFormate(item.date, "MM-DD")
            );
            this.elecTotalOptions.options.series.forEach(uu => {
              uu.data = [...uu.data, item[uu.key]];
            });
          });
        }
        this.formatterElecTotalExcelData(chartData);
      }
    },
    async getHelpMaterELecCure() {
      this.helpMeterExcelData = [];
      this.helpMaterOptions.options.xAxis.data = [];
      this.helpMaterOptions.options.series[0].data = [];
      let requestData = {
        dtuId:this.version=='2'? this.allDevices[0].dtuId:this.currentDevice.id,
        start: this.date[0],
        end: this.date[1]
      };
      let { data } = await apiGetHelpMaterELecCure(requestData);
      if (data) {
        let dataArr = [],
          valueArr = [];
        data.forEach(item => {
          dataArr.push(momentFormate(item.time, "MM-DD"));
          valueArr.push(item.value);
        });

        this.helpMeterExcelData = data;
        this.helpMaterOptions.options.xAxis.data = dataArr;
        this.helpMaterOptions.options.series[0].data = valueArr;
      }
    }
  }
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
.profitStatistics {
  .card-wrapper {
    height: 180px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;

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
