<template>
    <div ref="svg1" class="svg-wrapper">
        <span :class="'value ' + layout">
            <el-tag
                :type="parseInt(value) !== 0 ? 'warning' : 'info'"
                size="small"
                >{{ value }}</el-tag
            >
        </span>
        <svg version="1.1" style="width: 100%; height: 100%">
            <path
                :d="point"
                v-if="flag"
                fill="none"
                :stroke="parseFloat(value) === 0 ? '#fff' : color"
                stroke-width="3"
                stroke-dasharray="4"
                :class="
                    parseFloat(value) === 0
                        ? ''
                        : parseFloat(value) > 0
                        ? 'charge'
                        : 'disCharge'
                "
            ></path>
        </svg>
    </div>
</template>

<script>
export default {
    name: "RunLine",
    data() {
        return {
            point: "",
            flag: true,
        };
    },
    props: {
        value: {
            type: String,
            default: 1,
        },
        layout: {
            type: String,
            default: "",
        },
        color: {
            type: String,
            default: "red",
        },
    },
    mounted() {
        this.getPath();
        window.onresize = () => {
            this.flag = false;
            setTimeout((_) => {
                this.getPath();
                this.flag = true;
            }, 0);
        };
    },
    methods: {
        getPath() {
            let width = this.$refs.svg1.offsetWidth - 5;
            let height = this.$refs.svg1.offsetHeight - 5;
            if (this.layout === "pvLayout") {
                this.point = `M 5 5 L 5 ${height} L ${width} ${height}`;
            }
            if (this.layout === "gridLayout") {
                this.point = `M 5 ${height} L ${width} ${height} L ${width} 5`;
            }
            if (this.layout === "batteryLayout") {
                this.point = `M 5 ${height} L 5 5 L ${width} 5`;
            }
            if (this.layout === "usedLayout") {
                this.point = `M 50 5 L 50 ${height}`;
            }
            if (this.layout === "loadLayout") {
                this.point = `M 5 5 L ${width} 5 L ${width} ${height}`;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.svg-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    .value {
        width: fit-content;
        position: absolute;
        color: $primary-color;
        font-weight: bolder;
        font-size: 15px;
        &.usedLayout {
            bottom: 50%;
            left: 60%;
        }
        &.pvLayout,
        &.gridLayout {
            bottom: 15px;
            left: 50%;
        }
        &.batteryLayout,
        &.loadLayout {
            top: 20px;
            left: 50%;
        }
    }
}
.charge {
    animation: charge 0.4s linear infinite;
}
@keyframes charge {
    100% {
        stroke-dashoffset: -8;
    }
}
.disCharge {
    animation: disCharge 0.4s linear infinite;
}
@keyframes disCharge {
    100% {
        stroke-dashoffset: 8;
    }
}
</style>
