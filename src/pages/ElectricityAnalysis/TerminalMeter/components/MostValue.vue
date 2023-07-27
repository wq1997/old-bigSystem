<template>
    <div class="mostValue">
        <div class="title">
            {{ $translate(value.title) }}
        </div>
        <div class="value">
            <span> {{ value.value }}</span>
            <span class="unit">{{ value.unit }}</span>
        </div>
        <div class="time">
            {{ formateTime(value.time) }}
        </div>
    </div>
</template>

<script>
import { momentFormate } from "@/common/utils";
export default {
    name: "MostValue",
    props: {
        value: {
            type: Object,
            default: (_) => {},
        },
    },
    computed: {
        formateTime() {
            return (value) => {
                let format = "YYYY-MM-DD";
                if (Array.isArray(value)) {
                    return `${momentFormate(
                        value[0],
                        format
                    )} ~ ${momentFormate(value[1], format)}`;
                }
                return momentFormate(value, format);
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.mostValue {
    width: 100%;
    height: 100%;
    @include dis-flex(stretch, stretch, column);

    > div {
        @include dis-flex(center, center);
    }

    .title {
        height: 30px;
        border-bottom: 1px solid #999;
    }

    .value {
        flex: 1;
        font-size: 25px;
        font-family: fantasy;
        @include font-color("1");
        .unit {
            font-size: 15px;
            position: relative;
            left: 5px;
            top: 3px;
        }
    }

    .time {
        height: 30px;
    }
}
</style>
