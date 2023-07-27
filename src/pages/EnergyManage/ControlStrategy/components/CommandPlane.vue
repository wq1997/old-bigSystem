<template>
  <div class="chartPlane">
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
  name: "CommandPlane"
};
</script>

<style lang="scss" scoped>
.chartPlane {
  @include bg-color("2");
  margin: 20px 0;
  border-radius: 5px;
  .title {
    height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    @include dis-flex(space-between, center);
    font-size: 14px;
    font-weight: bolder;
    position: relative;
    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 14px;
      background: #fff;
      position: absolute;
      top: 13px;
      left: 10px;
    }
  }
  .content {
    padding: 20px;
    position: relative;
    > div {
      @include dis-flex();
    }
  }
}
</style>
