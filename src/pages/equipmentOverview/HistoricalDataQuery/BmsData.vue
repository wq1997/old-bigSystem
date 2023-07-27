<!--  -->
<template>
  <div class="select">
    <div class="boxSelect">
      <!-- <el-date-picker v-model="value1" type="datetime" size="mini" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"
        @change="dataQueryDev">

      </el-date-picker> -->
      <el-cascader v-model="value2" :options="options" :props="props" size="mini" collapse-tags placeholder="选择设备"
        @change="queryDev" clearable></el-cascader>
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
      "电池SOH",
        "电池电流",
        "电池电压",
        "电池SOC",
      ],
      unit: [
      "%",
        "A",
        "V",
        "%",
      ],
      data: []
    };

  },
  created() {

  },
  methods: {
    ...device_actions(["queryDevice", "queryDevData", "getSummary"]),
    getOptions(data) {
      this.options=[];
      data.map((item, index) => {
        let obj = {};
        obj["value"] = item.id;
        let arr=item.cNo.toString().split('');
        obj["label"] = `#0${+arr[arr.length-1]+1}舱`;
        if (item.bmsCount !== 0) {
          let children = [];
          for (let i = 0; i < item.bmsCount; i++) {
            let secObj = {};
            secObj["value"] = i;
            secObj["label"] = `#0${i + 1}BMS`;
            secObj["name"] = obj["label"] + `#0${i + 1}BMS`;
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
        type: 2
      }) : this.queryDevData({
        date: this.value1,
        containers: value,
        type: 2,
        plantId: this.currentPlant.plantId,
      })
    },
    dataQueryDev(value) {
      value == null && this.value2 == 0 ? this.getSummary({
        plantId: this.currentPlant.plantId,
        type: 2
      }) : this.queryDevData({
        date: value,
        containers: this.value2,
        type: 2,
        plantId: this.currentPlant.plantId,
      })
    },

    getDataInfo(val) {
      let i = 0;
      let one = [];
      for (const key in val) {
        let obj = {};
        if (key !== "name") {
          obj["name"] = this.dataName[i];
          obj["val"] = val[key];
          obj["unit"] = this.unit[i];
          obj.title = val["name"];
          i++;
          one.push(obj);
        console.log(val[key],obj);

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
      type: 2
    }).then(() => {
      this.allDevDetails.map((item) => {
        this.data.push(this.getDataInfo(item))
      });
    })
  },
  components: {
    Cabin,
    DatePick: (_) => import("@/components/DatePick"),
  },
  watch: {
    allDevDetails(n, o) {
      this.data = [];
      n.map((item) => {
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