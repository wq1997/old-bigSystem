<template>
  <div>
    <div class="card-title">
      <i :class="'iconfont ' + chartArgs.icon"></i>
      <span>{{ $translate(chartArgs.title) }}</span>
    </div>
    <div class="card-content" :ref="chartArgs.ref"></div>
  </div>
</template>

<script>
import { momentFormate } from "@/common/utils";
import { dayTypes, tooltipStyle, colorList } from "@/common/config";
export default {
  name: "Chart",
  props: {
    chartArgs: {
      type: Object,
      default: _ => {}
    }
  },
  data() {
    return {
      chartElem: null
    };
  },
  mounted() {
    this.chartElem = this.$echarts.init(this.$refs[this.chartArgs.ref]);
  },
  methods: {
    initChart(data) {
      let { ref, unit, type, color } = this.chartArgs;
      let date = [];
      let value = [];
      data.forEach(item => {
        date.push(momentFormate(item.date, "MM-DD"));
        if (ref === "prChart") {
          value.push(item.efficiency);
        } else if (ref === "trendChart") {
          value.push(item.electic);
        } else {
          value.push(item.plan);
        }
      });
      let colorStyle = new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: color
        },
        {
          offset: 1,
          color: "white"
        }
      ]);
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line"
          },
          ...tooltipStyle
        },
        grid: {
          show: true,
          x: 40,
          y: 40,
          x2: 30,
          y2: 30
        },
        xAxis: {
          type: "category",
          data: date,
          axisLabel: {
            rotate: 30
          },
          name: this.$translate("时间"),
          nameLocation: "end",
          nameGap: "7"
        },
        yAxis: {
          type: "value",
          name: unit,
          nameLocation: "end"
        },
        series: [
          {
            data: value,
            type: type,
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: { width: 1 },
                color: colorStyle
              }
            },
            areaStyle: {
              color: colorStyle
            }
          }
        ]
      };
      this.chartElem.setOption(option);
    }
  },
  watch: {
    chartArgs: {
      deep: true,
      immediate: true,
      handler: function(newVal) {
        this.$nextTick(_ => this.initChart(newVal.data));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card-title {
  padding: 0 20px;
  box-sizing: border-box;
  @include dis-flex(flex-start, center);
  i {
    margin-right: 8px;
  }
}
.card-content {
  padding: 0 20px;
  box-sizing: border-box;
  @include dis-flex(center, stretch, column);
}
</style>
