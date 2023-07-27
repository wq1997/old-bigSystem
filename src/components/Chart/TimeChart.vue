<template>
  <chart :ref="args.ref" :options="options" :auto-resize="true"></chart>
</template>

<script>
import { tooltipStyle, getSeriesStyle } from "@/common/utils.echarts";
import { deepClone } from "@/common/utils";
import { lineColor, labelColor } from "@/assets/styles/echarts-dark.scss";
import { loadingOptions } from "@/common/utils.echarts";
export default {
  name: "TimeChart",
  data() {
    return {
      baseOptions: {
        legend: {
          left: 4,
          orient: "vertical",
          textStyle: {
            fontSize: 12,
            color: labelColor,
          },
          type: "scroll",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
          ...tooltipStyle,
        },
        dataZoom: [{ type: "inside" }],
        toolbox: {
          show: true,
          right: 25,
          feature: {
            magicType: { type: ["line", "bar"], title: "" },
            dataZoom: {
              yAxisIndex: "none",
            },
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "time",
          name: this.$translate("时间"),
          splitNumber: 12,
          axisPointer: {
            type: "line",
            lineStyle: {
              width: 1,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              width: 1,
              type: "dashed",
            },
          },
          axisLine: {
            lineStyle: {
              color: lineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: labelColor,
            },
          },
        },
        yAxis: {
          type: "value",
          nameLocation: "end",
          splitNumber: 5,
          splitLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              width: 1,
              type: "dashed",
            },
          },
          axisLine: {
            lineStyle: {
              color: lineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: labelColor,
            },
          },
        },
        series: [],
      },
      options: {},
    };
  },
  props: {
    args: {
      type: Object,
      default: (_) => {},
    },
  },
  methods: {
    mergeOptions() {
      let chartInstance = this.$refs[this.args.ref];
      if (chartInstance) {
        chartInstance.showLoading(loadingOptions);
        setTimeout((_) => {
          chartInstance.hideLoading();
        }, 500);
      }
      this.options = deepClone(this.baseOptions);
      let { colorIndex, options: aOptions } = this.args;
      Object.keys(aOptions).forEach((item) => {
        if (item === "series") {
          aOptions.series.forEach((uu, index) => {
            this.options.series[index] = {
              type: "line",
              ...getSeriesStyle(colorIndex || index),
              ...uu,
            };
          });
        } else {
          let type = Object.prototype.toString.call(this.options[item]);
          if (type === "[object Array]") {
            this.options[item] = [...this.options[item], ...aOptions[item]];
          } else {
            this.options[item] = {
              ...this.options[item],
              ...aOptions[item],
            };
          }
        }
      });
    },
  },
  watch: {
    args: {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.mergeOptions();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
