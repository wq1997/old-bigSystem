<template>
  <div class="containerIndex">
    <div class="left-wrapper">
      <Left />
    </div>
    <div class="right-wrapper">
      <Header/>
      <Map />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions: plant_actions } = createNamespacedHelpers("plant");
const { mapActions: device_actions } = createNamespacedHelpers("device");
export default {
  name: "ContainerIndex",
  components: {
    Header: (_) => import("./components/Header"),
    Map: (_) => import("./components/Map"),
    Right: (_) => import("./components/Right"),
    Left: (_) => import("./components/Left"),
    Footer: (_) => import("@/components/Footer"),
  },
  mounted() {
    this.getDevicePermissions({ type: 0 });
    this.getAllPlants();
  },
  methods: {
    ...plant_actions(["getAllPlants"]),
    ...device_actions(["getDevicePermissions"]),
  },
};
</script>

<style lang="scss" scoped>
.containerIndex {
  height: 100vh;
  position: relative;
  @include bg-color("1");
  box-sizing: border-box;
  display: flex;
  > div {
    height: 100%;
  }

  .left-wrapper {
    width: 20%;
    margin-right: 20px;
  }
.header{
  width: 100%;
  height: 60px;

}
  .right-wrapper {
    flex: 2;

  }
}
</style>
