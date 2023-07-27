<template>
  <div>
    <el-container class="wrap">
  <el-aside :width="!toggleSideBar?'220px':'60px'"><Sider/></el-aside>
  <el-container class="right">
    <el-header><Header /></el-header>
    <Breadcrumb/>
    <el-main> <Main /></el-main>
  </el-container>
</el-container>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
const { mapMutations: app_mutations, mapGetters: app_getters } =
  createNamespacedHelpers("app");
export default {
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...app_getters(["toggleSideBar"]),

  },
  methods: {
    ...app_mutations(["set_toggleSideBar"]),

  },
  created() {},
  mounted() {},
  components: {
    Header: (_) => import("./components/Header"),
    Main: (_) => import("./components/Main"),
    Sider: _ => import("./components//Sider.vue"),
    Breadcrumb:(_)=>import("@/components/Breadcrumb")
  },
};
</script>
<style lang="scss" scoped>
.wrap{
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}
  .el-header{
  @include bg-color("2");
  }
  .right{
    width: 100%;
    height: 100%;
  }
  .el-aside {
 height: 100vh;
  position: relative;
  top: 0;
  left: 0;
  text-align: center;
  @include bg-color("2");
  transition: width 0.5s;
  }
  
  .el-main {
    height: 100vh;
  min-height: 100vh;
  // margin-bottom: 100px;

  top: 60px;
  @include bg-color("1");
  padding: 20px;
  padding-top: 0;
  padding-bottom: 120px;
  box-sizing: border-box;
  > div {
    margin: 0 auto;
  }
  }
  
  body > .el-container {
    // margin-bottom: 100px;
  }
</style>