<template>
    <div class="plane-box">
        <div class="tagHead">
            <slot name="tagHead"></slot>
        </div>
        <div class="title">
            <slot name="title"></slot>
        </div>
        <div class="content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "PlaneBox",
};
</script>

<style lang="scss" scoped>
.plane-box {
    @include bg-color("2");
    height: calc(100vh - 350px);
    min-height: 350px;
    margin: 20px 0;
    border-radius: 5px;

    .title {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        box-sizing: border-box;
        font-size: 15px;
        font-weight: bolder;
        position: relative;

        &::before {
            content: "";
            display: inline-block;
            width: 3px;
            height: 14px;
            background: $colorful-1;
            position: absolute;
            top: 13px;
            left: 10px;
        }
    }

    .content {
        height: calc(100% - 40px);
        position: relative;
    }

    .tagHead {
        width: 100%;
        // height: 40px;
    }
}</style>
