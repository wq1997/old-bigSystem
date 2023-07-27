<template>
    <div
        :class="'battery-single ' + [+options.value.soc ? 'shadow' : '']"
        :style="{ '--color': options.color }"
    >
        <span class="soc val" :style="{'--transform':options.value.direction+'deg'}">
            {{ options.value.soc }}<span class="unit">%</span></span
        >
        <div
            :class="'electric-current ' + chargeState(options.value.current)"
            :style="{ '--width': options.value.soc + '%' }"
        ></div>
    </div>
</template> 

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
    name: "Battery",
    props: ["options"],
    computed: {
        ...device_getters(["currentDevice"]),
        chargeState() {
            return (value) => {
                let active = false,
                    direction;
                if (this.currentDevice.type != 8) {
                    active = value != 0;
                } else {
                    active = value <= -3 || value >= 3;
                }
                direction = value > 0 ? "disCharge" : "charge";
                return active ? direction : "";
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.val {
    font-size: 15px;
    font-family: DINCondensed-Bold;
}
.unit {
    margin-left: 3px;
    font-size: 13px;
    font-family: DINCondensed-Bold;
}
.battery-single {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 5px;
    @include bg-color("1");
    &.shadow {
        box-shadow: 2px 0 10px var(--color);
    }
    @include dis-flex(center, center);
    &::after {
        content: "";
        display: inline-block;
        height: 4px;
        width: 32%;
        border-left: none;
        position: absolute;
        bottom: -6px;
        top: 100%;
        left: 34%;
        border-radius: 0 3px 3px 0;
        @include bg-color("1");
    }

    .soc {
        z-index: 100;
        transform: rotateX(var(--transform));

        @include font-color("1");
    }
    .electric-current {
        height: var(--width);
        width: 100%;
        background: var(--color);
        // background: linear-gradient(to right, var(--color) 80%, #1b2535);
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px;
    }
    .disCharge {
        animation: DisCharge 5s infinite linear;
    }
    @keyframes DisCharge {
        0% {
            height: var(--width);
        }
        to {
            height: 0%;
        }
    }
    .charge {
        animation: Charge 8s infinite linear;
    }
    @keyframes Charge {
        0% {
            height: 0%;
        }
        to {
            height: var(--width);
        }
    }
}
</style>
