<template>
    <div>
        <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <template v-for="item in tabData ">
                <el-tab-pane :label="item.label" :name="item.name"></el-tab-pane>
            </template>
        </el-tabs> -->
        <component :is="isComponent"></component>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const {
    mapGetters: device_getters,
    mapMutations: device_mutations,
    mapActions: device_actions,
} = createNamespacedHelpers("device");
export default {
    props: {},
    data() {
        return {
            formatComponents: {},
            tabData: [
                {
                    label: '报警查询',
                    name: "AlarmSearch",
                },
            ],
            activeName: "AlarmSearch",
            componentsList: {
                // RunMonitor: "RunMonitor",//需要引入具体的组件
                AlarmSearch: "AlarmSearch",
            }
        };
    },
    watch: {},
    computed: {
        isComponent() {
            return this.componentsList[this.activeName];
        }
    },
    methods: {
        ...device_actions(["getContainer"]),
        handleClick(tab, event) {
        },
    },
    created() { },
    mounted() {

    },
    components: {
        // RunMonitor: (_) => import("@/pages/ElectricityAnalysis/RunMonitor"),
        // EnergyMonitor: (_) => import("@/pages/EnergyManage/EnergyMonitor"),
        AlarmSearch: (_) => import("@/pages/Alarm/AlarmSearch"),


    },
};
</script>
<style lang="scss" scoped>
.is-active{
    border-bottom: none !important;
    height: 101%;

}
</style>

