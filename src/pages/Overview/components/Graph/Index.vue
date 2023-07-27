<template>
  <div class="graph">
    <div class="battery-side" ref="batteryPathBox">
      <div
        v-for="(item, index) in batteryValue"
        :key="index + 'battery'"
        class="group"
      >
        <div class="vol">
          <span
            class="val"
            :style="{
              color: activeColor,
            }"
          >
            {{ item.valtage }}<span class="unit">V</span>
          </span>
        </div>
        <Battery
          :options="{
            color: batteryStatus(item.current).battery.color,
            value: { soc: item.soc, current: item.current },
          }"
        />
        <div class="batteryPath">
          <span
            class="current val"
            :style="{
              color: batteryStatus(item.current).animatePath.color,
            }"
            >{{ item.current }}
            <span class="unit">A</span>
          </span>
          <AnimatePath
            class="path"
            ref="path"
            :path="batteryAnimatePath"
            :options="batteryStatus(item.current).animatePath"
          />
        </div>
      </div>
    </div>
    <div class="pcs-load-side" ref="pcsLoadBox">
      <div class="pcs">
        <div class="status">
          <div
            v-for="(item, index) in pcsStatus"
            :key="index"
            :style="{
              color:
                item.val != 0
                  ? item.link
                    ? 'rgb(245, 108, 108)'
                    : activeColor
                  : '',
            }"
          >
            {{ item.key }}
          </div>
        </div>
        <div class="animate">
          <IconBox
            :isActive="pcsOnline && status.pcs.active"
            iconClassName="icon-bingxiang"
            :color="status.pcs.color"
          />
          <div
            class="icon-box"
            :style="{
              color: status.pcs.active ? status.pcs.color : '',
            }"
          >
            <i class="iconfont icon-dianbiao meter"></i>
            <span class="icon-value val">
              {{ status.pcs.value }}
              <span class="unit">kW</span></span
            >
          </div>
          <div class="path">
            <AnimatePath :path="pcsAnimatePath" :options="status.pcs" />
          </div>
        </div>
      </div>
      <div class="load">
        <div class="animate">
          <div class="extra"></div>
          <IconBox
            :isActive="status.load.active"
            iconClassName="icon-chatou"
            :color="status.load.color"
          />
          <div v-show="currentDevice.type == 8" style="width: 30px"></div>
          <div
            v-show="currentDevice.type != 8"
            class="icon-box"
            :style="{
              color: status.load.active ? status.load.color : '',
            }"
          >
            <i class="iconfont icon-dianbiao meter"></i>
            <span class="icon-value val">
              {{ status.load.value }}<span class="unit">kW</span></span
            >
          </div>
          <div class="path">
            <AnimatePath :path="loadAnimatePath" :options="status.load" />
          </div>
        </div>
      </div>
    </div>
    <div class="grid-side">
      <IconBox
        :isActive="status.grid.active"
        iconClassName="icon-dianwanggongsi"
        :color="status.grid.color"
      />
      <div class="animate-path-box" ref="gridAnimatePathBox">
        <div
          class="icon-box meter"
          :style="{
            color: status.grid.active ? status.grid.color : '',
          }"
        >
          <i class="iconfont icon-dianbiao meter"></i>
          <span class="icon-value val">
            {{ status.grid.value }}
            <span class="unit">kW</span>
          </span>
        </div>
        <AnimatePath :path="gridAnimatePath" :options="status.grid" />
      </div>
    </div>
  </div>
</template> 

<script>
import { createNamespacedHelpers } from "vuex";
import { thtotate, debounce } from "../../../../common/utils";
import IconBox from "./components/IconBox";
import Battery from "./components/Battery";
import AnimatePath from "./components/AnimatePath";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
  name: "Graph",
  props: ["batteryValue", "pcsStatus", "meterValue", "pcsOnline"],
  components: {
    IconBox,
    AnimatePath,
    Battery,
  },
  data() {
    return {
      activeColor: "#3af3a7",
      pcsAnimatePath: "",
      loadAnimatePath: "",
      gridAnimatePath: "",
      batteryAnimatePath: "",
      windowWidth: document.documentElement.clientWidth, //获取屏幕宽度
      windowHeight: document.documentElement.clientHeight, //获取屏幕高度
    };
  },
  watch: {},
  computed: {
    status() {
      let { totalActivePowerEne, totalActivePowerUsed, totalActivePowerAll } =
        this.meterValue;

      let pcsActive =
        totalActivePowerEne != 0 && totalActivePowerEne != undefined;
      let gridActive =
        totalActivePowerAll != 0 && totalActivePowerAll != undefined;
      let loadActive;
      if (this.currentDevice.type != 8) {
        loadActive =
          totalActivePowerUsed != 0 && totalActivePowerUsed != undefined;
      } else {
        loadActive = true;
      }

      return {
        pcs: {
          active: pcsActive,
          color: pcsActive ? this.activeColor : "",
          path: "",
          value: totalActivePowerEne,
          direction: totalActivePowerEne > 0 ? "backward" : "forward",
        },
        grid: {
          active: gridActive,
          color: gridActive ? this.activeColor : "",
          path: "",
          value: totalActivePowerAll,
          direction: totalActivePowerAll > 0 ? "forward" : "backward",
        },
        load: {
          active: pcsActive,
          color: pcsActive ? this.activeColor : "",
          path: "",
          value: totalActivePowerUsed,
          direction: "backward",
        },
      };
    },
    batteryStatus() {
      return (current) => {
        let active = false,
          color = this.activeColor;
        if (this.currentDevice.type != 8) {
          active = current != 0;
        } else {
          active = current <= -3 || current >= 3;
        }
        return {
          battery: {
            color,
          },
          animatePath: {
            active,
            color: active ? "red" : "",
            direction: current > 0 ? "forward" : "backward",
          },
        };
      };
    },
    ...device_getters(["currentDevice"]),
  },
  mounted() {
    this.$nextTick(() => {
      this.initGridAnimatePath();
      this.initPcsLoadAnimatePath();
      this.initBatteryAnimatePath();
    });
    // const a = debounce(this.b, 700);
    window.onresize = () => {
      this.initGridAnimatePath();
      this.initPcsLoadAnimatePath();
      this.initBatteryAnimatePath();
    };
  },
  methods: {
    initGridAnimatePath() {
      let gridAnimatePathBoxEl = this.$refs.gridAnimatePathBox,
        width = gridAnimatePathBoxEl.clientWidth,
        height = gridAnimatePathBoxEl.clientHeight - 5;
      this.gridAnimatePath = `M ${width / 2} 0 V${height} H 5 `;
    },
    initPcsLoadAnimatePath() {
      let width = this.$refs.pcsLoadBox.clientWidth;
      this.pcsAnimatePath = `M 5 5 H ${width}`;
      this.loadAnimatePath = `M 5 5 H ${width}`;
    },
    initBatteryAnimatePath() {
      let width = this.$refs.batteryPathBox.clientWidth;
      let height = this.$refs.batteryPathBox.clientHeight;
      this.batteryAnimatePath = `M 0 ${((height / 8) * 0.7) / 2} H ${width}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  position: relative;

  .icon-value {
    position: absolute;
    top: 35px;
    width: 100px;
    text-align: center;
  }
}

.grid-side,
.pcs-load-side {
  border-left: 5px solid #82848a42;
  padding: 0 10px;
  box-sizing: border-box;
  z-index: 999;
  background: "#1c2a39";
  display: flex;
  flex-direction: column;
  align-items: center;

  .iconfont {
    margin-bottom: 5px;
    @include bg-color("2");

    &.pcs,
    &.load {
      font-size: 60px;
      margin-bottom: 5px;
    }

    &.meter {
      font-size: 30px;
    }
  }
}

.graph {
  width: 100%;
  height: calc(100vh - 360px);
  min-height: 450px;
  max-height: 800px;
  @include bg-color("2");
  margin-bottom: 15px;
  padding: 30px;
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  overflow: hidden;

  .val {
    font-size: 18px;
    font-family: DINCondensed-Bold;
  }

  .unit {
    margin-left: 3px;
    font-size: 13px;
    font-family: DINCondensed-Bold;
  }

  .battery-side {
    flex: 4;

    .group {
      height: 12%;
      min-height: 50px;
      display: flex;

      > div {
        flex: 2;
        height: 70%;

        &.vol {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
        }

        &.batteryPath {
          width: 100%;
          padding: 0 20px;
          box-sizing: border-box;
          position: relative;

          .current {
            position: absolute;
            right: 24px;
            font-size: 15px;
          }
        }
      }
    }
  }

  .pcs-load-side {
    flex: 4;

    .meter {
      margin-bottom: -2px;
    }

    .pcs,
    .load {
      width: 100%;
      height: 50%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .animate {
        width: 100%;
        height: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;

        .path {
          position: absolute;
          left: 0;
          right: 0;
          height: 12px;
        }
      }
    }

    .pcs {
      height: calc(50% + 20px);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .status {
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;

        > div {
          padding: 4px 10px;
          border: 1px solid;
          border-radius: 3px;
        }
      }
    }

    .load {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .extra {
        height: 100%;
        width: 30%;
        position: absolute;
        @include bg-color("2");
        left: 0;
        z-index: 88;
      }

      i {
        position: relative;
        left: -2px;
      }
    }
  }

  .grid-side {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .animate-path-box {
      width: 100%;
      height: calc(50% - 56px);
      position: relative;
    }

    .icon-box {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 17px);
    }
  }
}
</style>
