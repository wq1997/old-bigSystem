<template>
  <div class="pcsPower">
    <div class="search-wrapper">
      <div>
        <span class="search-name">{{ $translate("日期") }}：</span>
        <DatePick
          :defaultDate="date"
          type="date"
          @change="changeDate"
        ></DatePick>
      </div>
      <el-button type="primary" size="mini" @click="getChartsData">{{
        $translate("查询")
      }}</el-button>
    </div>
    <PlaneBox>
      <span slot="title">{{ $translate("PCS功率曲线") }}</span>
      <TimeChart :args="chartArgs" slot="content" />
    </PlaneBox>
  </div>
</template>

<script>
import { nowTime, momentFormate, getEchatsData } from "@/common/utils";
import { apiPcsPower } from "@/api/device";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
  name: "PcsPower",
  data() {
    return {
      date: nowTime(0, "YYYY-MM-DD"),
      chartArgs: {
        ref: "pcsPower",
        colorIndex: 0,
        options: {
          yAxis: {
            name: "KW"
          },
          series: [{ name: this.$translate("功率"), data: [] }]
        }
      }
    };
  },
  mounted() {
    this.getChartsData();
  },
  components: {
    DatePick: _ => import("@/components/DatePick"),
    PlaneBox: _ => import("@/components/PlaneBox"),
    TimeChart: _ => import("@/components/Chart/TimeChart")
  },
  computed: {
    ...device_getters(["currentDevice"])
  },
  methods: {
    async getChartsData() {
      let requestData = {
        dtuId: this.currentDevice.id,
        date: this.date
      };
      let { data } = await apiPcsPower(requestData);
      this.chartArgs.options.series[0].data = getEchatsData(
        data ? JSON.parse(data) : []
      );
    },
    changeDate(value) {
      this.date = value;
    }
  }
};
</script>
