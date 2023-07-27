<template>
  <transition mode="out-in">
    <div
      :class="{ icon_box: true, breath: isActive }"
      :style="{ '--color': color || '#999' }"
    >
      <i :class="'iconfont ' + iconClassName"></i>
    </div>
  </transition>
</template>

<script>
export default {
  name: "IconBox",
  props: ["isActive", "iconClassName", "color"],
};
</script>

<style lang="scss" scoped>
.breath {
  @include icon_breath(var(--color));
}
.icon_box {
  width: 64px;
  height: 64px;
  position: relative;
  border: 1.5px solid var(--color);
  border-radius: 50%;
  color: #999;
  z-index: 999;
  @include dis-flex(center, center);
  box-sizing: border-box;
  transition: all 0.4s ease-in-out;

  @include bg-color("2");
  .iconfont {
    font-size: 35px;
    color: var(--color);
    @include bg-color("2");
  }
  &:hover {
    // width: 100px;
    // height: 100px;
    // i {
    //   font-size: 50px;
    //   transition: all 0.4s ease-in-out;
    // }
  }
}
// .v-enter,
// .v-leave-to {
//   opacity: 1;
//   transform: translateX(240px);
// }

// .v-enter-active,
// .v-leave-active {
//   opacity: 1;
//   transition: all 0.3s ease;
// }
</style>
