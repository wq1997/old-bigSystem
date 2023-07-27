<!--  -->
<template>
  <div class="select">
    <div class="boxSelect">
      <!-- <el-date-picker v-model="value1" type="datetime" size="mini" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"
        @change="dataQueryDev">

      </el-date-picker> -->
      <el-cascader v-model="value2" :options="options" :props="props" size="mini" collapse-tags placeholder="选择设备"
        @change="queryDev" clearable></el-cascader>
    <!-- <el-select v-model="currentGroup" size="mini" placeholder="数据查找 ">
              <el-option
                v-for="item in batteryGroup"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
              </el-select> -->
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
        "W线电压",
        "V线电流",
        "W线电流",
        "总无功功率",
        "V线电压",
        "功率因数",
        "总功有功率",
        "u线电压",
        "u线电流",
      ],
      unit: [
        "V",
        "A",
        "A",
        "Kw",
        "V",
        "",
        "Kw",
        "V",
        "A",
      ],
      data:[]

    };

  },
  created() {

  },
  methods: {
    ...device_actions(["queryDevice", "queryDevData", "getSummary"]),
    getOptions(data) {
      data.map((item, index) => {
        let obj = {};
        obj["value"] = item.id;
        obj["label"] = `#0${index + 1}舱`;
        if (item.pcsCount !== 0) {
          let children = [];
          for (let i = 0; i < item.pcsCount; i++) {
            let secObj = {};
            secObj["value"] = i;
            secObj["label"] = `#0${i + 1}PCS`;
            secObj["name"] = obj["label"] + `#0${i + 1}PCS`;
            children.push(secObj);
          };
          obj["children"] = children;
          this.options.push(obj);
        }
      })
    },
    queryDev(value) {
      let a = this.options.find(val =>
        val.id === value[length - 1]
      )
      value.length == 0 && this.value1 == null ? this.getSummary({
        plantId: this.currentPlant.plantId,
        type: 1
      }) : this.queryDevData({
        date: this.value1,
        containers: value,
        type: 1,
        plantId: this.currentPlant.plantId,
      }).then(() => {

      });
    },
    dataQueryDev(value) {
      value == null && this.value2 == 0 ? this.getSummary({
        plantId: this.currentPlant.plantId,
        type: 1
      }) : this.queryDevData({
        date: value,
        containers: this.value2,
        type: 1,
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
    this.queryDevice({ plantId: this.currentPlant.plantId }).then(() => this.getOptions(this.queryDeviceData));
    this.getSummary({
      plantId: this.currentPlant.plantId,
      type: 1
    })
  },
  components: {
    Cabin,
    DatePick: (_) => import("@/components/DatePick"),
  },
  watch: {
    allDevDetails(n,o){
      this.data=[];
      n.map((item)=>{
              this.data.push(this.getDataInfo(item))
            });
      }
    },
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