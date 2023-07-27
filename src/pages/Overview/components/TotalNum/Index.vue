<template>
    <div class="totalNum">
        <div v-for="(item, index) in totalData" :key="index">
            <span class="title"> {{ $translate(item.title) }} </span>
            <span class="value"
                >{{ item.value }} <span class="unit">kWh</span></span
            >
        </div>
    </div>
</template>

<script>
export default {
    name: "TotalNum",
    props: {
        totalData: {
            type: Array,
            default: (_) => [],
        },
    },
};
</script>

<style lang="scss" scoped>
.totalNum {
    height: 180px;
    margin-bottom: 15px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    grid-gap: 15px;
    > div {
        flex: 1;
        border-radius: 5px;
        @include bg-color("2");
        @include dis-flex(center, center, column);
        box-sizing: border-box;
        .title {
            margin-bottom: 10px;
        }
        .value {
            font-weight: bolder;
            font-size: 50px;
            margin-right: 5px;
            @include font-color("1");
            font-family: DINCondensed-Bold;
            .unit {
                font-size: 15px;
                font-family: fangsong;
                color: $text-color;
            }
        }
    }
}
</style>
