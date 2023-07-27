<template>
    <div :class="'battery ' + [parseFloat(value.current) ? 'shadow' : '']">
        <span class="soc">soc：{{ value.soc }}</span>
        <div
            :class="
                'electric-current ' + chargeState(parseFloat(value.current))
            "
            :style="{ width: value.soc }"
        ></div>
    </div>
</template>

<script>
export default {
    name: "BatteryFlow",
    props: {
        value: {
            type: Object,
            default: (_) => {},
        },
    },
    computed: {
        chargeState() {
            return (value) =>
                value === 0 ? "" : value > 0 ? "disCharge" : "charge";
        },
    },
};
</script>

<style lang="scss" scoped>
.battery {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 5px;
    border: 1px solid #999;
    box-sizing: border-box;
    &.shadow {
        border: 1px solid #18ba83;
        box-shadow: 2px 0 10px #18ba83;
        &::after {
            background: #18ba83;
        }
    }
    @include dis-flex(center, center);
    &::after {
        content: "";
        display: inline-block;
        width: 3px;
        height: 28%;
        background: #999;
        border-left: none;
        position: absolute;
        right: -5px;
        top: 29%;
        border-radius: 0 3px 3px 0;
    }

    .soc {
        z-index: 100;
        @include font-color("1");
        font-family: DINCondensed-Bold;
    }
    .electric-current {
        width: 100%;
        height: 100%;
        background: #18ba83;
        position: absolute;
        left: 0;
        border-radius: 5px 0 0 5px;
    }
    .disCharge {
        animation: DisCharge 5s infinite linear;
    }
    @keyframes DisCharge {
        0% {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }
    .charge {
        animation: Charge 8s infinite linear;
    }
    @keyframes Charge {
        0% {
            width: 0%;
        }
        to {
            width: 100%;
        }
    }
}
</style>
