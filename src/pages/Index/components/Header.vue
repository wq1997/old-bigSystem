<template>
  <div class="header dark-box" :width="!toggleSideBar ? 'calc(100%-200px)' : 'calc(100%-60px)'">
    <!-- <div class="companyInfo">
      <img :src="userInfo.url" alt="" />
      <span>{{ $translate("上海采日能源科技有限公司") }} </span>
    </div> -->
    <div class="nameBar">
      <tagSiderBar class="hamburger-container" @toggleClick='handelToggleSideBar' :is-active="toggleSideBar"
        v-if="this.version == '2' && this.$route.path !== '/containerIndex'" />
      <span class="system-name">{{ $translate("采日云平台监控系统") }}</span>
    </div>

    <div class="end-wrapper">
      <div class="count">
        <div>
          <div class="value" :style="{ color: colorful.colorful_2 }">
            {{ allPlants.length }}
          </div>
          <div class="name">{{ $translate("电站总数") }}</div>
        </div>
        <div>
          <div class="value" :style="{ color: colorful.colorful_3 }">
            {{ devicesCount }}
          </div>
          <div class="name">{{ $translate("设备总数") }}</div>
        </div>
      </div>
      <el-badge v-if="this.$route.path!=='/containerIndex'" :value="activeAlarmCount" :max="99">
        <i class="iconfont icon-lingdang" :style="{
            color: activeAlarmCount ? '#F56C6C' : '',
          }" @click="alarmTo"></i>
      </el-badge>
      <el-tooltip effect="dark" :content="$translate('切换主题')" placement="bottom">
        <i class="iconfont icon-zhuti theme" @click="changeTheme"></i>
      </el-tooltip>
      <el-tooltip effect="dark" :content="$translate('退出登录')" placement="bottom">
        <i class="iconfont icon-tuichudenglu signOut" @click="signOut"></i>
      </el-tooltip>
      <!-- <el-tooltip
        effect="dark"
        :content="$translate('返回') + $translate('首页')"
        placement="bottom"
        v-if="$route.path !== '/containerIndex'"
      >
        <i
          class="iconfont icon-fangzi signOut"
          @click="
            $router.push({
              path: '/containerIndex',
            })
          "
        ></i>
      </el-tooltip> -->
    </div>
    <ChangeTheme />
  </div>
</template>

<script>
import { redirectPath, deepClone } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
import colorful from "@/assets/styles/config.scss";
const { mapGetters: user_getters } = createNamespacedHelpers("user");
const { mapGetters: plant_getters } = createNamespacedHelpers("plant");
const { mapGetters: device_getters, mapActions: device_actions } =
  createNamespacedHelpers("device");
const { mapMutations: app_mutations, mapGetters: app_getters } =
  createNamespacedHelpers("app");
export default {
  name: "Header",
  data() {
    return {
      routes: [],
      containId:null,
    };
  },
  methods: {
    ...device_actions(["getDevicesCount"]),
    ...app_mutations(["set_themeVisible", "set_toggleSideBar"]),
    handelToggleSideBar() {
      this.set_toggleSideBar(!this.toggleSideBar);
    },
    alarmTo(){
      // this.$router.push("/containerIndex/equipmentOverview/alarm")
    },
    signOut() {
      redirectPath("/");
    },
    changeTheme() {
      this.set_themeVisible(true);
    },
    // handleSelect(key) {
    //   if (key === "/system/reset") {
    //     this.subscribe();
    //     this.goReset();
    //   } else {
    //     redirectPath(key);
    //   }
    // },
    initRoutes() {
      this.routes = deepClone(this.$router.options.routes[4].children);
    },
  },
  computed: {
    ...user_getters(["userInfo", "activeAlarmCount"]),
    ...plant_getters(["allPlants"]),
    ...device_getters(["devicesCount", "devicePermissions", "version"]),
    ...app_getters(["systemTheme", "toggleSideBar"]),
    colorful() {
      return colorful;
    },
    menuStyle() {
      let lightTheme = {
        menuTextColor: "#999",
        menuBg: "#fff",
      };
      let blackTheme = {
        menuTextColor: "#fff",
        menuBg: "#212223",
      };
      let greenTheme = {
        menuTextColor: "#fff",
        menuBg: "#1c2a39",
      };
      let _themeNav = {
        light: lightTheme,
        black: blackTheme,
        green: greenTheme,
      };
      return _themeNav[this.systemTheme];
    },
    activePathFn() {
      return this.$route.path;
    },
  },
  components: {
    ChangeTheme: (_) => import("@/components/ChangeTheme"),
    tagSiderBar: (_) => import("@/components/Hamburger"),
  },
  mounted() {
    this.getDevicesCount();
    this.initRoutes();
   console.log();
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
  padding: 0 40px 0 0px;
  box-sizing: border-box;
  @include dis-flex(space-between, center);

  .companyInfo {
    @include dis-flex(space-between, center);
    font-size: 16px;
    font-weight: bolder;

    img {
      width: 100px;
      height: 42px;
      margin-right: 20px;
    }
  }

  .nameBar {
    display: flex;

  }

  .hamburger-container {
    cursor: pointer;
  }

  .system-name {
    font-size: 21px;
    font-weight: 600;
    white-space: nowrap;
    @include font-color("1");
    display: inline-block;

  }

  .end-wrapper {
    @include dis-flex(center, center);
    position: fixed;
    right: 20px;

    .count {
      @include dis-flex();

      >div {
        margin-right: 30px;
        text-align: center;

        .value {
          margin-bottom: 5px;
          font-weight: bold;
          font-size: 25px;
          font-family: DINCondensed-Bold;
        }

        .name {
          font-size: 12px;
        }
      }
    }

    i {
      font-size: 20px;
      cursor: pointer;

      &.signOut,&.theme {
        margin-left: 20px;
      }
    }

    .el-menu {
      border-bottom: solid 1px #1c2a39;
    }
  }
}
</style>
