<template>
    <div class="left">
        <div class="dark-box" v-for="(item, index) in todayValue" :key="index">
            <div class="card-title">
                <i :class="'iconfont ' + item.icon"></i>
                <span> {{ $translate(item.title) }}</span>
            </div>
            <div class="card-content">
                <div class="today-value">{{ item.todayValue }}</div>
                <div class="unit">{{ $translate(item.unit) }}</div>
                <div class="sum-text">{{ $translate(item.sumText) }}</div>
                <div class="sum-value">
                    <span></span>
                    <span class="value">{{ item.sumValue }}</span>
                    <span> {{ $translate(item.unit) }}</span>
                </div>
            </div>
        </div>
        <div class="dark-box">
            <div class="card-title">
                <i class="iconfont icon-tubiao-"></i>
                <span>{{ $translate("节能减排") }}</span>
            </div>
            <div class="card-content energy">
                <div v-for="(item, index) in energyValue" :key="index">
                    <i :class="'iconfont ' + item.icon"></i>
                    <span> {{ $translate(item.text) }}</span>
                    <span class="value">{{ item.value }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { apiGetDailyDisCharge } from "@/api/plant";

export default {
    name: "Left",
    data() {
        return {
            todayValue: [
                {
                    title: "当日放电",
                    icon: "icon-dian",
                    unit: "度",
                    todayValue: 0,
                    sumText: "总放电量",
                    sumValue: 0,
                },
                {
                    title: "当日收益",
                    icon: "icon-fenxiangzhuanshouyi",
                    unit: "元",
                    todayValue: 0,
                    sumText: "总收益",
                    sumValue: 0,
                },
            ],
            energyValue: [
                {
                    icon: "icon-meiqi",
                    text: "累计节煤",
                    value: 0,
                },
                {
                    icon: "icon-co",
                    text: "CO₂减排量",
                    value: 0,
                },
                {
                    icon: "icon-lvyouchengshijianzhucity-treexiaoheshumur",
                    text: "折合树木",
                    value: 0,
                },
            ],
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        async getData() {
            let { data } = await apiGetDailyDisCharge();
            if (data) {
                data = JSON.parse(data);
                this.todayValue[0].todayValue = data.dailyDisCharge;
                this.todayValue[0].sumValue = data.sumDisCharge;
                this.todayValue[1].todayValue = data.dailyProfit;
                this.todayValue[1].sumValue = data.sumProfit;
                this.energyValue[0].value = data.coal;
                this.energyValue[1].value = data.co2;
                this.energyValue[2].value = data.tree;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.left {
    width: 100%;
    height: 100%;
    @include dis-flex(center, stretch, column);

    > div {
        flex: 1;
        &:not(:last-child) {
            margin-bottom: 20px;
        }
        .card-title {
            font-size: 18px;
            padding: 0 20px;
            box-sizing: border-box;
            @include dis-flex(flex-start, center);

            i {
                font-size: 18px;
                margin-right: 8px;
                color: $colorful-6;
            }
        }

        .card-content {
            padding: 0 20px;
            box-sizing: border-box;
            @include dis-flex(center, stretch, column);

            .today-value {
                flex: 2;
                font-size: 60px;
                @include font-color("1");
                font-weight: bold;
                font-family: DINCondensed-Bold;
                @include dis-flex(center, center);
            }

            .unit,
            .sum-text,
            .sum-value {
                flex: 1;
                font-size: 20px;
                .value {
                    font-size: 30px;
                    font-family: DINCondensed-Bold;
                    color: $colorful-2;
                }
            }

            .unit {
                @include dis-flex(flex-end, center);
            }

            .sum-text {
                @include dis-flex(flex-start, center);
            }

            .sum-value {
                @include dis-flex(space-between, center);
            }

            &.energy {
                > div {
                    flex: 1;
                    font-size: 20px;
                    @include dis-flex(space-between, center);
                    i {
                        font-size: 20px;
                        color: $colorful-6;
                    }
                    &:not(:last-child) {
                        border-bottom: 1px solid rgba(235, 221, 227, 0.09);
                    }
                    .value {
                        font-size: 30px;
                        font-family: DINCondensed-Bold;
                        color: $colorful-3;
                    }
                }
            }
        }
    }
}
</style>
