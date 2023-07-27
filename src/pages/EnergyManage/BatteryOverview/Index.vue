<template>
    <div class="batteryOverview">
        <div class="btns-curve">
            <el-button
                size="mini"
                v-for="item in btns"
                :key="item.type"
                :type="item.type === curveType ? 'primary' : ''"
                @click="handleChangeCurveType(item.type)"
            >
                {{ $translate(item.text) }}</el-button
            >
        </div>
        <keep-alive>
            <component :is="curveType"></component>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: "BatteryOverview",
    data() {
        return {
            curveType: "MonitorCurve",
            btns: [
                { text: "监测曲线", type: "MonitorCurve" },
                { text: "实时数值", type: "RealCurve" },
            ],
        };
    },
    components: {
        MonitorCurve: (_) => import("./components/MonitorCurve"),
        RealCurve: (_) => import("./components/RealCurve"),
    },
    methods: {
        handleChangeCurveType(type) {
            this.curveType = type;
        },
    },
};
</script>

<style lang="scss" scoped>
.batteryOverview {
    .btns-curve {
        text-align: center;
        margin-bottom: 20px;
    }
}
</style>
