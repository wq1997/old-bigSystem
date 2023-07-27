<template>
  <div class="equipmentWrapper">
    <!-- <BoxDevices :all="all" class="BoxDevices" /> -->
    <iframe class="Td" src="	https://admin.sovitjs.com/publish_2d/3250638613561475073" frameborder="0"
      v-if="value === 0"></iframe>
    <tDBox  v-if="value === 1" />
    <div class="tapBtn">
      <el-switch v-model="value" class="isShow" :active-value=1 :inactive-value=0 active-text="3D" inactive-text="2D"
        active-color="#13ce66" inactive-color="#ff4949" @change="switchAb">
      </el-switch>

    </div>
  
  </div>
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
    return {
      value: 1,
      all: [
        {
          name: "1#",
        },
        {
          name: "2#",
        },
        {
          name: "3#",
        },
        {
          name: "4#",
        },
        {
          name: "5#",
        },
        {
          name: "6#",
        },
        {
          name: "7#",
        },
        {
          name: "8#",
        },
      ],
    };
  },
  watch: {},
  computed: {},
  methods: {
    ...device_actions(["getContainer"]),
    switchAb(val) {
      // console.log(val);
    }
  },
  created() { },
  mounted() { },
  components: {
    BoxDevices: () => import("./Container.vue"),
    tDBox: (_) => import("../../containerDetail/components/TubeMap.vue")
  },
};
</script>
<style lang="scss" scoped>
.equipmentWrapper {
  width: 100%;
  height: 100vh;
  min-height: 550px;
  // max-height: 800px;
  @include bg-color("2");
  padding: 0px 0 30 0;
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  .tapBtn {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-bottom: 5px;
    position: absolute;
    /*打开时文字位置设置*/
    top: 0px;
    // z-index: 10;
    .isShow .el-switch__label--right {
      z-index: 11;
      right: 8px;
    }

    /*关闭时文字位置设置*/
    .isShow .el-switch__label--left {
      z-index: 11;
      left: 8px;
    }

    /*显示文字*/
    .isShow .el-switch__label.is-active {
      display: block;
    }

    .isShow.el-switch .el-switch__core,
    .el-switch .el-switch__label {
      width: 50px !important;
    }
  }

  .BoxDevices {
    width: 100%;
  }

  .isShow .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }
  .el-switch{
    z-index: 999 !important;
  }
  .Td {
    width: 100%;
    height: 100%;
  }

}
</style>