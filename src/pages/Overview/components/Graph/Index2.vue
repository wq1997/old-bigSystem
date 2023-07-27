<template>
    <div class="graph">
        <div class="batteryPcs" >
            <div class="batteryGroup batteryMain">
                <div class="battery" ref="batteryPathBox">
                    <div class="group" v-for="(item, index) in batteryValue" :key="index + 'battery'">
                        <div class="vol">
                            <span class="val" :style="{
                                color: activeColor,
                            }">
                                {{ item.valtage }}<span class="unit">V</span>
                            </span>
                        </div>
                        <Battery :options="{
                            color: batteryStatus(item.current).battery.color,
                            value: { soc: item.soc, current: item.current },
                        }" />
                        <div class="batteryPath">
                            <span class="current val" :style="{
                               color: batteryStatus(item.current).animatePath
                                .color,
                            }">{{ item.current }}
                                <span class="unit">A</span>
                            </span>
                            <AnimatePath class="path" ref="path" :path="batteryAnimatePath"
                        :options="batteryStatus(item.current).animatePath" />
                        </div>
                    </div>
                </div>
                <div class="pcs" ref="pcsLoadBox">
                    <AnimatePath class="path" ref="path" :path="pcsAnimatePath"
                            :options="status.pcs" />
                     <IconBox
                       :isActive="pcsOnline && status.pcs.active"
                        iconClassName="icon-bingxiang"
                        :color="status.pcs.color"
                        class="pcsLogo logo"
                    />
                   
                </div>
            </div>
            <div class="batteryGroup">
                <div class="battery" ref="batteryPathBox"> </div>
                <div class="pcs"></div>
            </div>
        </div>
        <div class="Electrical">
            <div class="transformer " >
                <div class="meter " ref="gridAnimatePathBox"
                >       
                        <AnimatePath
                             class="path" ref="path"
                            :path="gridAnimatePath"
                            :options="status.load"
                        />
                        <div class="logo">
                         <IconBox
                        :isActive="pcsOnline && status.pcs.active"
                        iconClassName="icon-dianbiao"
                        :color="status.pcs.color"
                    />
                        <span class="icon-value val" style="margin-left:12px;">
                            {{ status.load.value}}<span class="unit">kW</span></span
                        >
                    </div>
                </div>
                <div class="powerGrid">

                     <AnimatePath
                             class="path" ref="path"
                            :path="loadAnimatePath"
                            :options="status.load"
                        />
                         <IconBox
                        :isActive="status.grid.active"
                        iconClassName="icon-dianwanggongsi"
                        :color="status.grid.color"
                        class="logo"
                    />
                </div>
                </div>
            <div class="load">
                <div class="loadSide">
<AnimatePath
                             class="path" ref="path"
                            :path="gridAnimatePath"
                            :options="status.load"
                        />
                         <IconBox
                        :isActive="status.grid.active"
                        iconClassName="icon-susheyongdian"
                        :color="status.grid.color"
                        class="logo"
                    />
                </div>
                </div>
            </div>
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
    props: ["batteryValue", "pcsStatus", "meterValue", "pcsOnline"],
    data() {
        return {
            activeColor: "#3af3a7",
            pcsAnimatePath: "",
            loadAnimatePath: "",
            gridAnimatePath: "",
            batteryAnimatePath: "",
            // windowWidth: document.documentElement.clientWidth, //获取屏幕宽度
            // windowHeight: document.documentElement.clientHeight, //获取屏幕高度

        }
    },
    watch: {},
    computed: {
        status() {
            let {
                totalActivePowerEne,
                totalActivePowerUsed,
                totalActivePowerAll,
            } = this.meterValue;

            let pcsActive =
                totalActivePowerEne != 0 && totalActivePowerEne != undefined;
            let gridActive =
                totalActivePowerAll != 0 && totalActivePowerAll != undefined;
            let loadActive;
            if (this.currentDevice.type != 8) {
                loadActive =
                    totalActivePowerUsed != 0 &&
                    totalActivePowerUsed != undefined;
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
            let gridAnimatePathBoxEl = this.$refs.gridAnimatePathBox,
                width = gridAnimatePathBoxEl.clientWidth;
            this.gridAnimatePath = `M 5 5 H ${width} `;
        },
        initPcsLoadAnimatePath() {
            let width = this.$refs.pcsLoadBox.clientWidth;
            this.pcsAnimatePath = `M 3 5 H ${width}`;
            this.loadAnimatePath = `M 3 5 H ${width}`;
        },
        initBatteryAnimatePath() {
            let width = this.$refs.batteryPathBox.clientWidth;
            let height = this.$refs.batteryPathBox.clientHeight;
            this.batteryAnimatePath = `M 10 ${
                ((height / 15) * 0.7) / 2
                } H ${width-280}`;
            console.log(this.batteryAnimatePath);
        },
    },
    created() { },
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
    }
}
</script>
<style lang="scss" scoped>
.graph {
    width: 100%;
    height: calc(100vh - 300px);
    min-height: 450px;
    max-height: 800px;
    @include bg-color("2");
    margin-bottom: 15px;
    padding: 30px;
    box-sizing: border-box;
    border-radius: 8px;
    display: flex;
    overflow: hidden;

    .logo{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%)
    }
    .path {
                    width: 100%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%)
                }
    .batteryPcs {
        flex: 2;

        .batteryGroup {
            width: 100%;
            height: 50%;
            // padding: 15px 5px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            .battery {
                width: 60%;
                height: 100%;
                border-right: 5px solid #82848a42;

                .group {
                    height: 12%;
                    min-height: 31px;
                    display: flex;
                    align-items: center;
                    >div {
                        flex: 4;
                        height: 70%;

                        &.vol {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex: 1;
                        }

                        &.batteryPath {
                            width: 100%;
                            // padding: 0 20px; 
                            box-sizing: border-box;
                            position: relative;

                            .current {
                                position: absolute;
                                right: 24px;
                                top: -15px;
                                font-size: 15px;
                            }
                        }
                    }
                }
            }

            .pcs {
                width: 40%;
                position: relative;
            }
        }

    }

    .Electrical {
        flex: 2;
        .transformer{
            width: 100%;
            height: 50%;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;

            .meter{
                box-sizing: border-box;
                width: 60%;
                height: 100%;
                border-right: 5px solid #82848a42;
                position: relative;
                // background-color: #000;
            }
            .powerGrid{
                 width: 40%;
                position: relative;
                height: 100%;

            }
        }
        .load{
                  width: 100%;
            height: 50%;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            .loadSide{
                 box-sizing: border-box;
                width: 60%;
                height: 100%;
                border-right: 5px solid #82848a42;
                position: relative;
            }
        }
    }

}
</style>    