<template>
  <div class="detailsWrapper">
    <div class="packGroup">
      <Battery  :BMC="BMC[0]" :deriction="0"/>
      <Battery  :BMC="BMC[1]" :deriction="deriction"  class="pack-bottom" ref="pack-bottom" />
    </div>
    <div class="packData">
      <div class="pack1Data" v-for="item in BMS">
        <div class="packDetails">
          <CardInfo :BMS="item" />
        </div>
      </div>
    </div>
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
      deriction:-180,
    };
  },
  watch: {},
  computed: {
    ...device_getters(["allDevices", "version","BMS","BMC"]),
  },
  methods: {
  },
  created() {
    
  },
  mounted() {},
  components: {
    Battery: () => import("../components/BatteryPack.vue"),
    BatteryVertical: () => import("../components/batteryCloum.vue"),
    CardInfo: () => import("../components/cardInfo.vue"),
  },
};
</script>
<style lang="scss" scoped>
.detailsWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  @include bg-color("2");
  align-items: center;
  .packGroup {
    width: 70%;
    height: 70%;
    margin-right: 2.2%;
    .pack-bottom {
      transform: rotateX(180deg);

    }
  }
  .packData {
    width: 30%;
    height: 70%;
    .pack1Data {
      width: 100%;
      height: 50%;
      display: flex;
      padding-bottom: 5%;
      margin-top: 2%;
      box-sizing: border-box;
    }
  }
  .packPath {
    width: 20%;
    height: 50%;
    border-bottom: 4px solid #37414e;
  }
  .packDetails {
    width: 100%;
    background-color: rgba($color: #37414e, $alpha: 0.3);
    border-radius: 5%;
    margin-left: 10%;
    margin-right: 5%;
    min-height: 200px;
    
  }
}
</style>