<template>
  <div class="graph">
    <el-row :gutter="5">
      <el-col :span="12">
        <div class="card">
          <div class="battery-pcs cardWrap">
            <div class="battery-side left" ref="batteryPathBox">
              <div class="batteryWrap">
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
            </div>
            <div class="pcs-side right" ref="pcsLoadBox">
              <div class="animate">
                <IconBox
                  :isActive="pcsOnline && status.pcs.active"
                  iconClassName="icon-bingxiang"
                  :color="status.pcs.color"
                  class="icon"
                />
                <div class="path">
                  <AnimatePath
                    :path="pcsAnimatePath"
                    :options="status.pcs"
                    class="anyPath"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <div class="meter-powerGrid cardWrap">
            <div class="meter-side left" ref="left">
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
              <AnimatePath
                :path="gridAnimatePath"
                :options="status.pcs"
                class="anyPath"
              />
            </div>
            <div class="powerGrid-side right">
              <IconBox
                :isActive="status.grid.active"
                iconClassName="icon-dianwanggongsi"
                :color="status.grid.color"
                class="icon"
              />
              <AnimatePath
                style="width: 50%; left: 25%"
                :path="gridAnimatePath"
                :options="status.grid"
                class="anyPath"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <div class="card">
          <div class="battery-pcs cardWrap">
            <div
              v-show="SecondaryBatteryValue"
              class="battery-side left"
              ref="batteryPathBox"
            >
              <div class="batteryWrap">
                <div
                  v-for="(item, index) in SecondaryBatteryValue"
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
            </div>
            <div class="pcs-side right" ref="pcsLoadBox"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <div class="load-meter cardWrap">
            <div class="load-side left">
              <div
                class="icon-box"
                :style="{
                  color: status.load.active ? status.load.color : '',
                }"
              >
                <i class="iconfont icon-dianbiao meter"></i>
                <span class="icon-value val">
                  {{ status.load.value }}
                  <span class="unit">kW</span></span
                >
              </div>
              <IconBox
                :isActive="status.load.active"
                iconClassName="icon-susheyongdian"
                :color="status.load.color"
                class="icon"
                style="left: 12%"
              />
              <AnimatePath
                :path="gridAnimatePath"
                :options="status.load"
                class="anyPath"
                style="width: 90%; left: 55%"
              />
            </div>
            <div class="nothing-side right"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import IconBox from "./components/IconBox";
import Battery from "./components/Battery";
import AnimatePath from "./components/AnimatePath";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
  name: "Graph",
  props: [
    "batteryValue",
    "SecondaryBatteryValue",
    "pcsStatus",
    "meterValue",
    "pcsOnline",
    "alertTitle",
  ],
  data() {
    return {
      activeColor: "#3af3a7",
      pcsAnimatePath: "",
      loadAnimatePath: "",
      gridAnimatePath: "",
      batteryAnimatePath: "",
    };
  },
  watch: {},
  computed: {
    status() {
      let { totalActivePowerEne, totalActivePowerUsed, totalActivePowerAll } =
        this.meterValue;

      let pcsActive =
        totalActivePowerEne != 0 &&
        totalActivePowerEne != undefined &&
        !this.alertTitle;
      let gridActive =
        totalActivePowerAll != 0 &&
        totalActivePowerAll != undefined &&
        !this.alertTitle;
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
  methods: {
    initGridAnimatePath() {
      let gridAnimatePathBoxEl = this.$refs.left,
        width = gridAnimatePathBoxEl.clientWidth;
      this.gridAnimatePath = `M 5 5 H 20000 `;
    },
    initPcsLoadAnimatePath() {
      let width = this.$refs.pcsLoadBox.clientWidth;
      this.pcsAnimatePath = "M 3 5 H 20000";
      this.loadAnimatePath = `M 3 5 H 2000`;
    },
    initBatteryAnimatePath() {
      let width = this.$refs.batteryPathBox.clientWidth;
      let height = this.$refs.batteryPathBox.clientHeight;
      this.batteryAnimatePath = `M 0  ${((height / 10) * 0.4) / 2} H 20000`;
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.initGridAnimatePath();
      this.initPcsLoadAnimatePath();
      this.initBatteryAnimatePath();
    });
  },
  components: {
    IconBox,
    AnimatePath,
    Battery,
  },
};
</script>
<style lang="scss" scoped>
.icon-box {
  width: 100%;
  display: flex;
  // flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  position: relative;

  .icon-value {
    position: absolute;
    top: 60%;
    width: 100px;
    text-align: center;
  }

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
  height: calc(100vh - 310px);
  min-height: 610px;
  max-height: 800px;
  @include bg-color("2");
  margin-bottom: 15px;
  padding: 30px;
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;

  .el-row {
    height: 50%;
    margin-bottom: 5px;

    .el-col {
      height: 100%;

      .card {
        width: 100%;
        height: 100%;
        background-color: rgba($color: #fff, $alpha: 0.06);
        // border: 1px solid #887d7d;
        box-sizing: border-box;
        display: flex;
        flex: 2;
        border-radius: 8px;
        min-height: 250px;

        .cardWrap {
          width: 100%;
          height: 100%;
          display: flex;

          .left {
            width: 60%;
            height: 100%;
            border-right: 5px solid #888;
            position: relative;
            display: flex;

            .anyPath {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .icon {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 999;
            }
          }

          .right {
            width: 40%;
            height: 100%;
            position: relative;

            .anyPath {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .icon {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }

          .battery-side {
            // flex: 4;
            display: flex;
            flex-direction: column;
            justify-self: center;

            .batteryWrap {
              padding-top: 10px;

              .group {
                height: 12%;
                min-height: 32px;
                display: flex;
                align-items: center;

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
                    padding-top: 10px;

                    .current {
                      position: absolute;
                      right: 24px;
                      top: -5px;
                      font-size: 12px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>