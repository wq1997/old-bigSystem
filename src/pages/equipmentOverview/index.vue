<template>
    <router-view></router-view>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const {
  mapGetters: device_getters,
  mapMutations: device_mutations,
  mapActions: device_actions,
} = createNamespacedHelpers("device");
export default {
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    ...device_actions(["getContainer"]),
  },
  created() {},
  mounted() {},
  components: {  },
};
</script>
<style lang="scss" scoped>
</style>