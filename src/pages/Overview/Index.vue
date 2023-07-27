<template>
  <div>
    <el-alert
      v-show="alertTitle"
      :title="alertTitle"
      type="error"
      center
      show-icon
    >
    </el-alert>
    <TotalNum :totalData="totalData" />
    <Graph
      ref="graph"
      :batteryValue="batteryValue"
      :SecondaryBatteryValue="SecondaryBatteryValue"
      :meterValue="meterValue"
      :pcsStatus="pcsStatus"
      :pcsOnline="pcsOnline"
      :alertTitle="alertTitle"
    />
    <div class="table-wrapper-overview">
      <div v-for="(item, index) in 4" :class="tableType[index].className">
        <div>
          <div class="text">
            {{ $translate(tableType[index].text) }}
          </div>
          <template v-for="table in tableData">
            <div v-if="table && index == table.tableType">
              <TableData :data="table" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions: user_actions } = createNamespacedHelpers("user");
const { mapGetters: device_getters } = createNamespacedHelpers("device");
import {
  apiGetOverViewTablesData,
  apiGetOverViewGraph,
  apiIsNewData,
} from "@/api/device";
export default {
  name: "Overview",
  data() {
    return {
      tableType: {
        0: {
          className: "battery",
          text: "电芯数据",
        },
        1: {
          className: "bms-pcs",
          text: "BMS/PCS数据",
        },
        2: {
          className: " meter",
          text: "电表数据",
        },
        3: {
          className: "other",
          text: "辅助数据",
        },
      },
      alertTitle: "",
      timer: null,
      totalData: [
        { title: "总充电量", value: 0 },
        { title: "总放电量", value: 0 },
        { title: "日充电量", value: 0 },
        { title: "日放电量", value: 0 },
      ],
      batteryTableData: [],
      totalMetarValue: 0,
      sideMeterValue: 0,
      tableData: [],
      pcsStatus: [
        { target: "告警", status: 1, key: "warn" },
        { target: "运行", status: 1, key: "run" },
        { target: "故障", status: 0, key: "error" },
        { target: "待机", status: 1, key: "wait" },
        { target: "在线", status: 0, key: "online" },
        { target: "空闲", status: 1, key: "free" },
        { target: "上电", status: 1, key: "up" },
      ],
      batteryValue: [],
      SecondaryBatteryValue: [],
      pcsValue: {},
      meterValue: {},
      pcsStatus: {},
      pcsOnline: false,
      totalData: [
        { title: "总充电量", value: 0 },
        { title: "总放电量", value: 0 },
        { title: "日充电量", value: 0 },
        { title: "日放电量", value: 0 },
      ],
    };
  },
  components: {
    TotalNum: (_) => import("./components/TotalNum"),
    Graph: (_) => import("./components/Graph"),
    TableData: (_) => import("./components/TableData"),
  },
  computed: {
    ...device_getters(["currentDevice"]),
  },
  mounted() {
    this.getTablesData();
    this.getGraph();
    this.getActiveCount();
    this.isNewData();
    this.timer = setInterval(() => {
      this.getTablesData();
      this.getGraph();
      this.getActiveCount();
      this.isNewData();
    }, 24000);
  },
  methods: {
    ...user_actions(["getActiveCount"]),
    async isNewData() {
      let requestData = {
        flag: 2,
        dtuId: this.currentDevice.id,
      };
      let res = await apiIsNewData(requestData);
      if (res.code === "ok") {
        let { last, time } = JSON.parse(res.data);
        if (last) {
          this.alertTitle = "";
        } else {
          this.alertTitle = `${this.$translate(
            "断开连接,未采集到新数据"
          )}，${this.$translate("最后断连时间")}：${time}`;
        }
      } else {
        this.alertTitle = this.$translate("断开连接,未采集到新数据");
      }
    },
    async getTablesData() {
      let { data } = await apiGetOverViewTablesData({
        dtuId: this.currentDevice.id,
      });
      this.tableData = data || [];
    },
    async getGraph() {
      let { data } = await apiGetOverViewGraph({
        dtuId: this.currentDevice.id,
      });
      if (data) {
        let { batStatus, batStatus1, pcsStatus, meterStatus, pcsOnline } = data;
        this.batteryValue = batStatus;
        this.SecondaryBatteryValue = batStatus1;
        this.pcsStatus = pcsStatus;
        this.pcsOnline = pcsOnline;
        this.meterValue = meterStatus;
        let {
          dailyCharge,
          dailyDischarge,
          positiveActiveEnergy,
          reverseActiveEnergy,
        } = meterStatus;

        this.totalData[0].value = positiveActiveEnergy;
        this.totalData[1].value = reverseActiveEnergy;
        this.totalData[2].value = dailyCharge;
        this.totalData[3].value = dailyDischarge;
      }
    },
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss"  >
.el-alert {
  margin-bottom: 10px;
}

.table-wrapper-overview {
  padding: 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;

  .text {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    margin-bottom: 10px;
    @include font-color("1");
    box-sizing: border-box;
    border-radius: 8px;
    text-align: center;
  }

  .battery,
  .meter {
    .title,
    .text {
      background: #5daf341c !important;
    }
  }

  .bms-pcs,
  .other {
    .title,
    .text {
      background: #e6a23c21 !important;
    }
  }
}
</style> 
 