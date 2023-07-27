<!--  -->
<template>
  <div class="select">
    <div class="boxSelect">
      <!-- <el-date-picker v-model="value1" type="datetime" size="mini" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"
        @change="dataQueryDev">

      </el-date-picker> -->
    </div>
    <template v-for="item in data">
        <Cabin :data="item" />
      </template>
  </div>
</template>
    
<script>
import Cabin from "./components/Cabin.vue";
import { createNamespacedHelpers } from "vuex";
import { showMessage, setToken, redirectPath } from "@/common/utils";

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
  name: "",
  data() {
    return {
      props: { multiple: true },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      value1: '',
      value2: [],
      options: [

      ],
      dataName: [
      "PCS数量",
      "总无功功率",
      "功率因数",
      "电池累计放电",
      "总有功功率",
      "BMS数量",
      "当日收益",
      "电池累计充电",
      ],
      unit: [
      "个",
        "kW",
        "",
        "KWh",
        "kW",
        "个",
        "元",
        "KWh",
      ],
      data:[]

    };

  },
  created() {

  },
  methods: {
    ...device_actions(["getHistoricalSummary", "queryDevData", "getSummary"]),
   
    
    dataQueryDev(value) {
    this.getHistoricalSummary({
        date: value,
        // containers: this.value2,
        type: 4,
        plantId: this.currentPlant.plantId,
      })
    },
    getDataInfo(val){
            let i=0;
            let one=[];
                for (const key in val) {
                    let obj={};
                    if (key!=="name") {
                        obj["name"]=this.dataName[i];
                        obj["val"]=val[key];
                        obj["unit"]=this.unit[i];
                        obj.title=val["name"];
                        i++;
                        one.push(obj);
                    }
                }
                return one;
        },
  },
  computed: {
    ...device_getters(["allDevDetails", "queryDeviceData"]),
    ...plant_getters(["currentPlant",]),

  },
  mounted() {
    this.getHistoricalSummary({
      plantId: this.currentPlant.plantId,
      type: 4
    }).then(()=>{
              this.data.push(this.getDataInfo(this.allDevDetails))
          })
  },
  components: {
    Cabin,
    DatePick: (_) => import("@/components/DatePick"),
  }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.select {
  .boxSelect {
    margin-bottom: 20px;
  }
}
</style>