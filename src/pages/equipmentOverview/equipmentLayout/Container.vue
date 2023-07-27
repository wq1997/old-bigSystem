<template>
  <div>
    <transition mode="out-in">
      <div class="container">
        <template v-for="item in allDevices">
          <div class="device-item" @click="handleShowDetail(item)">
            <img :src="containerImg" alt="" />
            <span class="onLine"  draggable>{{ `${item.id}# ` }}</span>
            <!-- <div class="devBottomBtn">
              <span @click="handleShowMonitor(item) " @mouseover="selectSpan(1)" :class="{active:spanIsAcitve==1}">{{$translate('视屏监控') }}</span>
              <span @click="handleShowElectricity(item)" @mouseover="selectSpan(2)" :class="{active:spanIsAcitve==2}">{{$translate('报警查询') }}</span>
              <span @click="handleEnergyManage(item)" @mouseover="selectSpan(3)" :class="{active:spanIsAcitve==3}">{{$translate('数据分析') }}</span>
              <span @click="handleShowDetail(item)" @mouseover="selectSpan(4)" :class="{active:spanIsAcitve==4}">{{$translate('设备舱总览') }}</span>
            </div> -->
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import containerImg from "@/assets/images/box4.png";
import containerImgB from "@/assets/images/Bms.png";
import containerImgP from "@/assets/images/Pcs2.png";
import containerImgBP from "@/assets/images/BmsPcs.png";
import colorful from "@/assets/styles/config.scss";



import { createNamespacedHelpers } from "vuex";
const {
  mapGetters: device_getters,
  mapMutations: device_mutations,
  mapActions: device_actions,
} = createNamespacedHelpers("device");
export default {
  props: ["all"],
  data() {
    return {
      containerImg,
      routes: [],
      spanIsAcitve:1,
    };
  },
  watch: {},
  computed: {
    ...device_getters(["allDevices", "version","PCS","BMS"]),
  },
  methods: {
    ...device_actions(["getContainer"]),
    handleShowDetail(item) {
      sessionStorage.setItem("containerId", item.id)
      this.getContainer({
        containerId: item.id,
      });
      this.$router.push({
        path: "/containerIndex/equipmentOverview/containerDetail",
      });
    },
    containerImgf(){
        if (this.PCS.length!==0&&this.BMS.length!==0) {
          return containerImgBP
        }else if(this.PCS.length!==0&&this.BMS.length===0){
          return containerImgP
        }else if (this.PCS.length==0&&this.BMS.length!=0) {
          return containerImgB
        }else{
          return containerImg
        }
      },
  
    selectSpan(item){
      this.spanIsAcitve=item;

    },
    initRoutes() {
      this.routes = this.$router.options.routes[4].children;
      if (this.version == 2 && this.$router.options.routes[4].children.length != 8) {
        // window.location.reload();
      }
    },
  },
  created() { },
  mounted() {
    this.initRoutes();
  },
  components: {},
};
</script>
<style lang="scss" scoped>
.onLine {
  color: $colorful-1 !important;
  font-size: 20px;
}

.container {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr 1fr 1fr ;
  grid-template-rows: 33% 33% 33%;
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;

  .device-item {
    width: 100%;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 20px;
    @include dis-flex(center, center, column);
    padding: 5px;
    box-sizing: border-box;
    position: realtive;
    cursor: pointer;

    .id {
      font-size: 20px;
      font-family: DINCondensed-Bold;
    }

    &:hover {
      img {
        width: 230px;
      }
     
    }

    img {
      width: 150px;
      margin-bottom: 10px;
      transition: all 0.4s ease-in-out;
    }

    .devBottomBtn {
      width:80%;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      span{
       cursor: pointer;

      }
      &:hover{
        .active{
          color: #fff;
        }
      }
    }
  }
}
</style>