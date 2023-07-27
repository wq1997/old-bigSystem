<template>
  <div class="right">
    <Chart :chartArgs="prArgs" />
    <Chart :chartArgs="trendArgs" />
    <Chart :chartArgs="planArgs" />
  </div>
</template>

<script>
import { apiGetPrChart, apiGetTrendChart, apiGetPlanChart } from "@/api/plant";
export default {
  name: "Right",
  data() {
    return {
      prArgs: {
        title: "电站PR",
        icon: "icon-dianzhangaikuang",
        ref: "prChart",
        unit: this.$translate("效率"),
        type: "line",
        color: "rgb(106, 168, 79)",
        data: []
      },
      trendArgs: {
        title: "当月发电趋势",
        icon: "icon-qushi1",
        ref: "trendChart",
        unit: "kWh",
        type: "line",
        color: "#409eff",
        data: []
      },
      planArgs: {
        title: "发电计划",
        icon: "icon-jihua",
        ref: "planChart",
        unit: "kWh",
        type: "bar",
        color: "#404f82",
        data: []
      }
    };
  },
  components: {
    Chart: _ => import("./components/Chart")
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.getPrChart();
      this.getTrendChart();
      this.getPlanChart();
    },
    async getPrChart() {
      let { data } = await apiGetPrChart();
      if (data) {
        this.prArgs.data = JSON.parse(data);
      }
    },
    async getTrendChart() {
      let { data } = await apiGetTrendChart();
      if (data) {
        this.trendArgs.data = JSON.parse(data);
      }
    },
    async getPlanChart() {
      let { data } = await apiGetPlanChart();
      if (data) {
        this.planArgs.data = JSON.parse(data);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.right {
  position: absolute;
  top: 30px;
  right: 0;
  width: 24%;
  height: calc(100% - 30px);
  background: hsla(0, 0%, 100%, 0.89);
  box-shadow: 0 3px 52px hsla(0, 0%, 53.3%, 0.58);
  @include dis-flex(center, stretch, column);
  > div {
    flex: 1;
  }
}
</style>
