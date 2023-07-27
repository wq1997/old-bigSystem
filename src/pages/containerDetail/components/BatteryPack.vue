<template>
  <div class="battery-container">
    <div
      class="pack1"
      ref="pack1"
      :style="{
        '--padding-left': width * 0.7 + 'px',
      }"
    >
      <div
        class="batteryWrap"
        v-for="(item, index) in BMC"
        :ref="`wrap${index}`"
        :key="`wrap${index}`"
        @click="toCellDetails"
      >
        <Battery
          ref="battery"
          :options="{
            color: '#3af3a7',
            value: { soc: item.soc||'',
            direction:deriction||0},
          }"
          class="battery"
          :style="{ '--width': height * 0.7 + 'px' }"
        />
        <svg class="svg" version="1.1"
        :style="{ '--top': height * 0.72   + 'px' }"
        >
          <path
            fill="none"
            stroke-width="3"
            stroke="red"
            stroke-dasharray="4"
            :d="batteryAnimatePath"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { redirectPath, deepClone } from "@/common/utils";

export default {
  props: ["BMC","deriction"],
  data() {
    let count = 0;
    let width = 0;
    let height = 0;
    let batteryAnimatePath = ``;
    return {
      count,
      width,
      height,
      batteryAnimatePath,
    };
  },
  watch: {},
  computed: {},
  methods: {
    initBatteryAnimatePath() {
      this.width = this.$refs.wrap0[0].offsetWidth;
      this.height = this.$refs.wrap0[0].offsetHeight;
      this.batteryAnimatePath = `M ${this.width/2} 0 v ${this.height*0.4}`;
    },
    toCellDetails() {
      this.$router.push({
                    path: "/containerIndex/equipmentOverview/EnergyManage", 
                    query: {
                        id:sessionStorage.getItem('containerId')||null,
                    }
                })
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.initBatteryAnimatePath();
    });
    window.onresize = () => {
      this.initBatteryAnimatePath();
    };
  },
  components: {
    Battery: () =>
      import("./Battery.vue"),
    AnimatePath: () =>
      import("@/pages/Overview/components/Graph/components/AnimatePath"),
  },
};
</script>
<style lang="scss" scoped>
.battery-container {
  width: 100%;
  height: 50%;

  .pack1 {
    width: 100%;
    height: 100%;
    display: grid;
    grid-auto-flow: column;
    padding-left: 2%;
    padding-right: 1%;
    border-bottom: 4px solid #37414e;
    border-right: 4px solid #37414e;
    margin-bottom: 10px;
    .batteryWrap {
      max-width: 50px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-self: center;
      flex: 1;
      position: relative;
      .battery {
        height: 60%;
        // width: var(--width);
        width: 100%;
        cursor: pointer;
      }
    }
  }
}
.svg {
  height:40%;
  width: 100%;
  flex: 1;
}
</style>