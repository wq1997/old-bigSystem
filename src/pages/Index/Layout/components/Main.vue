<template>
  <div class="main">
    <TransitionWrapper>
      <router-view />
    </TransitionWrapper>
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
    TransitionWrapper: (_) => import("@/components/TransitionWrapper"),
  },
};
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  // box-sizing: border-box;
  overflow-y: scroll;
  margin-bottom: 20px;
  > div {
    margin: 0 auto;
  }
}
</style>