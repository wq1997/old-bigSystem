<template>
    <chart class="echarts" :ref="args.ref" :options="options" :auto-resize="true" @finished="finished"></chart>
</template>

<script>
import { tooltipStyle } from "@/common/utils.echarts";
import { deepClone } from "@/common/utils";
import { lineColor, labelColor } from "@/assets/styles/echarts-dark.scss";
import { loadingOptions } from "@/common/utils.echarts";
export default {
    name: "CategoryChart",
    data() {
        return {
            baseOptions: {
                legend: {
                    top: 4,
                    textStyle: {
                        fontSize: 12,
                        color: labelColor,
                    },
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "line",
                    },
                    ...tooltipStyle,
                },
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
                dataZoom: [

                {type: 'slider',
                    xAxisIndex: 0,
                   
                },
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    zoomOnMouseWheel:true,
                },

                ],
                xAxis: {
                    type: "category",
                    name: this.$translate("时间"),
                    splitNumber: 12,
                    axisPointer: {
                        type: "line",
                        lineStyle: {
                            width: 1.8,
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
                yAxis: [
                
                    ],
                series: [],
            },
            options: {},
        };
    },
    props: ['args'],
    methods: {
        finished() { },

        mergeOptions() {
            let chartInstance = this.$refs[this.args.ref];
            if (chartInstance) {
                chartInstance.showLoading(loadingOptions);
                setTimeout((_) => {
                    chartInstance.hideLoading();
                }, 1000);
            }
            this.options = deepClone(this.baseOptions);
            let { color, options: aOptions } = this.args;
            Object.keys(aOptions).forEach((item) => {
                if (item === "series"&& aOptions.series.length!==0) {
                    aOptions.series.forEach((uu, index) => {
                        this.options.series[index] = {
                            type: "bar",
                            symbolSize: 4,
                            showSymbol: false,
                            symbol: "diamond",
                            itemStyle: {
                                normal: {
                                    lineStyle: { width: 1.8 ,
                                       color: color[index]
                                    },
                                    color: color[index]
                                }
                            },
                            ...uu,
                        };
                    });
                } else {
                    let type = Object.prototype.toString.call(
                        this.options[item]
                    );
                    if (type === "[object Array]") {
                        this.options[item] = [
                            ...this.options[item],
                            ...aOptions[item],
                        ];
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
            handler: function (new1) {
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
