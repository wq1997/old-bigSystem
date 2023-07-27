<template>
  <div></div>
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
</style>