<!--  -->
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
const {
      mapGetters: plant_getters,
      mapMutations: plant_mutations,
      mapActions: plant_actions,
    } = createNamespacedHelpers("plant");
export default {
    name:"historicalDataQuery",
    data() {
        return {
            tabData: [
                {
                    label:'全局数据',
                    name: "AllData",
                },
                {
                    label:'PCS数据',
                    name: "PCSData",
                },
                {
                    label: 'BMS数据',
                    name: "BmsData",
                },

            ],
            activeName: "AllData",
            componentsList: {
                PCSData:"PCSData",
                AllData:"AllData",
                BmsData:"BmsData"
            },
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        ...device_actions(["queryDevice","queryDevData","getSummary"]),

        handleClick(tab, event) {
            this.getSummary({
            plantId:this.currentPlant.plantId,
            type:tab.index
          })

        },
    },
    components: {
        PCSData: (_) => import("@/pages/equipmentOverview/HistoricalDataQuery/PcsData"),
        AllData: (_) => import("@/pages/equipmentOverview/HistoricalDataQuery/AllData"),
        BmsData: (_) => import("@/pages/equipmentOverview/HistoricalDataQuery/BmsData"),
    },
    computed: {
        ...plant_getters(["currentPlant",]),
        ...device_getters(["allDevDetails","queryDeviceData"]),

        isComponent() {
            return this.componentsList[this.activeName];
        }
    },
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.is-active {
    color: $colorful-1;
}
</style>