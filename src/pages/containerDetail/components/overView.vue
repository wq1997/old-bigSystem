<template>
  <div class="overview">
    <Nav/>
    <!-- <TubeMap/> -->
    <AllBattery  v-if="type==2" key="2"     
 v-cloak/>
    <PcsAndBattery v-else-if="type==3" key="3" v-cloak/>
    <AllPcs v-else-if="type==1" key="1" v-cloak/>
    <div class="table-wrapper-overview">
      <div v-for="(item, index) in tableData" v-if="item.arr&&item.arr.length" :class="tableType[index].className" :key="item.title">
        <div>
          <div class="text" >
            {{ $translate(item.title)+$translate("数据") }}
          </div>
          <template v-for="table in tableData" >
            <div v-if="table.arr && item.title==table.title " :key="table.title">
              <TableData :data="table" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex';
  const {
    mapActions: device_actions,
    mapGetters:device_getters,
    mapMutations:device_mutations
  }=createNamespacedHelpers("device")
export default {
  props: {},
  data() {
    
    return {
      tableType: [ {
          className: "PCS",
          text: "PCS数据",
        }, {
          className: "BMS",
          text: "BMS数据",
        }, {
          className: "BMC",
          text: "BMC数据",
        },
         {
          className: "SENSOR",
          text: "辅助数据",
        },
      ],
      timer: null,
      loading:true
    };
  },
  watch: {
   
  },
  computed: {
    ...device_getters(["type","PCS","BMS","tableData"]),
    ListArr(){
      // console.log(this.tableData.filter((item)=>console.log(item.arr)));
        // return this.tableData.filter((item,index) => item.arr.length!== 0)
    }
  },
  methods: {
    ...device_mutations([]),
    ...device_actions(["getContainer","getTableData"]),
  },
  created() {
    this.getContainer({
      containerId: sessionStorage.getItem("containerId"),
    })
  },
  mounted() {
    this.loading=true;
    this.getTableData();
    this.timer = setInterval(() => {
    this.getTableData();
    this.getContainer({
      containerId: sessionStorage.getItem("containerId"),
    }).then(()=>{
      this.loading=false;
    })
  }, 24000);
  console.log(this.tableData);
  },
  components: {
    AllBattery: (_) => import("../AllBattery/Index.vue"),
    PcsAndBattery:(_)=>import("../BatteryAndPcs"),
    AllPcs:(_)=>import("../AllPcs"),
    TableData:(_)=>import("./TableData.vue"),
    Nav:(_)=>import("./DetailsNav.vue"),
    // TubeMap:(_)=>import("./TubeMap.vue")


  },
  destroyed () {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped>
.overview{
  width: 100%;
  height: 100%;
  min-height: 700px;
  max-height: 1300px;
  @include bg-color("2");
  padding-bottom: 100px;
  box-sizing: border-box;
  border-radius: 8px;
  overflow:auto;
  .table-wrapper-overview {
  // padding: 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  // @include bg-color("1");
  grid-gap: 10px;
  // margin-top: 50px;
  .text {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    margin-bottom: 10px;
    @include font-color("1");
    box-sizing: border-box;
    border-radius: 8px;
    text-align: center;
  }
  .PCS,
  .SENSOR {
    .title,
    .text {
      background: #5daf341c !important;
    }
  }
  .BMS,
  .BMC {
    .title,
    .text {
      background: #e6a23c21 !important;
    }
  }

}
[v-cloak] {
  display: none;
}
}
</style>  