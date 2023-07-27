<template>
    <div class="alarm-search">
        <el-tabs value="first" @tab-click="handleClick" >
            <el-tab-pane :label="$translate('实时报警')" name="first">
                <ActiveAlarm />
            </el-tab-pane>
            <el-tab-pane :label="$translate('历史报警')" name="second"
                ><HistoryAlarm
            /></el-tab-pane>
        </el-tabs>
        <!-- <HistoryAlarm /> -->
    </div>
</template>

<script>
export default {
    name: "AlarmSearch",
    data() {
        return {};
    },
    components: {
        ActiveAlarm: (_) => import("./components/ActiveAlarm"),
        HistoryAlarm: (_) => import("./components/HistoryAlarm"),
    },
    methods: {
        handleClick(tab, event) {},
    },
};
</script>

<style lang="scss" scoped>
.alarm-search {
    >>> .el-tabs {
        .el-tabs__nav-wrap::after {
            width: 152px;
        }
    }
}
</style>
