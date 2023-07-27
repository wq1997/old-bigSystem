<template>
    <div class="plane">
        <PlaneBox class="chartPlane-wrapper">
            <span slot="title"> {{ $translate(args.title) }}</span>
            <TimeChart
                v-if="args.ref === 'chargeDischargeCurve'"
                :args="args"
                slot="content"
            />
            <CategoryChart v-else :args="args" slot="content" />
        </PlaneBox>
        <template v-for="(item, index) in args.mostValue">
            <MostValue :key="index" :value="item"></MostValue>
        </template>
    </div>
</template>

<script>
export default {
    name: "PlaneChart",
    data() {
        return {
            chartElem: null,
        };
    },
    props: {
        args: {
            type: Object,
            default: (_) => {},
        },
    },
    components: {
        MostValue: (_) => import("./MostValue"),
        TimeChart: (_) => import("@/components/Chart/TimeChart"),
        CategoryChart: (_) => import("@/components/Chart/CategoryChart"),
        PlaneBox: (_) => import("@/components/PlaneBox"),
    },
};
</script>

<style lang="scss" scoped>
.plane {
    width: 100%;
    margin-bottom: 20px;
    display: grid;
    grid-template:
        "c1  c1  c2" 1fr
        "c1  c1  c3" 1fr
        "c1  c1  c4" 1fr
        /1fr 1fr 200px;
    grid-gap: 20px;

    > div {
        border-radius: 3px;
        @include bg-color("2");
    }

    .chartPlane-wrapper {
        grid-area: c1;
        margin: 0;
    }
}
</style>
