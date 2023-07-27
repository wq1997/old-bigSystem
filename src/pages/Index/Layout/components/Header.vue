<template>
  <div class="header">
    <Header />
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
  components: {
    Header: (_) => import("../../components/Header.vue"),
  },
};
</script>
<style lang="scss" scoped>
.header {
  width: calc(100% - 200px);
  height: 60px;
  @include bg-color("2");
  box-sizing: border-box;
  @include dis-flex(space-between, center);
  position: fixed;
  top: 0;
  // left: 200px;
  // z-index: 1000;
}
</style>