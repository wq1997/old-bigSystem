<template>
    <div class="detailsWrapper">
        <div class="packGroup">
            <Battery :BMC="BMC[0]" :deriction="0" />
            <Battery :BMC="BMC[1]" :deriction="deriction" class="pack-bottom" ref="pack-bottom" />
        </div>
        <div class="packData">
            <div class="pack1Data" v-for="item in PCS">
                <IconBox class="icon" :isActive="true" iconClassName="icon-bingxiang" color="#3af3a7" />
                <div class="path">
                    <AnimatePath :path="pcsAnimatePath" :options=options />
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { createNamespacedHelpers } from "vuex";
import pcsImg from "@/assets/images/pcs.png"
const {
    mapGetters: device_getters,
    mapMutations: device_mutations,
    mapActions: device_actions,
} = createNamespacedHelpers("device");
export default {
    props: {},
    data() {
        let pcsAnimatePath = `M 0 10 H 1000`;

        return {
            pcsImg,
            pcsAnimatePath,
            options: {
                active: true,
                direction: 'stop'
            },
            deriction: -180
        };
    },
    watch: {},
    computed: {
        ...device_getters(["allDevices", "version", "BMS", "BMC","PCS"]),

    },
    methods: {
        initPcsAnimatePath() {
            let width = this.$refs.pcsSvg.offsetWidth;
            this.pcsAnimatePath = `M 0 10 H ${width}`

        }
    },
    created() { },
    mounted() {
        window.onresize = () => {
            this.initPcsAnimatePath();
        };

    },
    components: {
        Battery: (_) => import("../components/BatteryPack.vue"),
        CardInfo: (_) => import("../components/cardInfo.vue"),
        AnimatePath: (_) => import("../../Overview/components/Graph/components/AnimatePath.vue"),
        IconBox: (_) => import("../../Overview/components/Graph/components/IconBox.vue")
    },
};
</script>
<style lang="scss" scoped>
.detailsWrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    @include bg-color("2");

    .packGroup {
        width: 70%;
        height: 70%;
        margin-right: 2.2%;

        .pack-bottom {
            margin-top: 10px;
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
            justify-content: center;
            align-items: center;

            // @include dis-flex("center","center");
            position: relative;

            .pcs {
                display: flex;
                flex-direction: column;
                justify-content: center;
                @include bg-color("2");
                z-index: 2;

                img {
                    width: 100px;
                    height: 100px;
                }
            }

            .path {
                position: absolute;
                left: 0;
                right: 0;
                height: 12px;
            }

        }
    }
}
</style>