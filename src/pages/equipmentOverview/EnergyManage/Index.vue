<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <template v-for="item in tabData ">
                <el-tab-pane :label="$translate(item.label)" :name="item.name"></el-tab-pane>
            </template>
        </el-tabs>
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
                    label: '电池总览',
                    name: "BatteryOverview",
                },
                {
                    label: '电芯详情',
                    name: "BatteryCluster",
                },
                {
                    label: '电池最大压差',
                    name: "MaxPressure",
                },
                {
                    label: '温差曲线',
                    name: "TempCurve",
                },
                {
                    label: '压差曲线',
                    name: "VolCurve",

                },
                {
                    label: '储能检测',
                    name: "EnergyMonitor",
                },

            ],
            activeName: "BatteryOverview",
            componentsList: {
                BatteryOverview: "BatteryOverview",
                BatteryCluster: "BatteryCluster",
                MaxPressure: "MaxPressure",
                TempCurve: "TempCurve",
                VolCurve: "VolCurve",
                EnergyMonitor: "EnergyMonitor"},
        };
    },
    watch: {},
    computed: {
        ...device_getters(["BMS", "PCS"]),
        isComponent() {
            return this.componentsList[this.activeName];
        }
    },
    methods: {
        ...device_actions(["getContainer"]),
        handleClick(tab, event) {
        },
        auth() {
            if (this.BMS.length!= 0 && this.PCS.length === 0) {
                this.tabData.pop();
            } else if (this.BMS.length === 0 && this.PCS.length != 0) {
                this.activeName="EnergyMonitor";
                this.componentsList =
                {
                    EnergyMonitor: "EnergyMonitor"
                };
                this.tabData = [
                    {
                        label: '储能检测',
                        name: "EnergyMonitor",

                    },
                ]
            }

        }
    },
    created() {
        this.auth();

    },
    mounted() {
    },
    components: {
        BatteryOverview: (_) => import("@/pages/EnergyManage/BatteryOverview"),
        BatteryCluster: (_) => import("@/pages/EnergyManage/BatteryCluster"),
        MaxPressure: (_) => import("@/pages/StatistiReport/MaxPressure"),
        TempCurve: (_) => import("@/pages/StatistiReport/TempCurve"),
        VolCurve: (_) => import("@/pages/StatistiReport/VolCurve"),
        EnergyMonitor: (_) => import("@/pages/EnergyManage/EnergyMonitor"),

    },
};
</script>
<style lang="scss" scoped>
.el-tabs__item.is-active {
    color: #3af3a7 !important;
}
.el-tabs{
    margin-left: 8px;

}
.el-tabs__nav{
    // border: 1px solid  $bg-color2;
}
</style>

