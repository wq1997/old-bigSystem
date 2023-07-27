<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :text-color="menuStyle.menuTextColor"
    active-text-color="#3af3a7" :background-color="menuStyle.menuBg" @select="handleSelect">
    <template v-for="item in routes">
      <el-submenu :index="item.path" v-if="item.children" :key="item.path">
        <template slot="title">
          <el-badge v-if="item.meta.icon === 'icon-lingdang' && activeAlarmCount" :value="activeAlarmCount" :max="99">
            <i :class="'iconfont ' + item.meta.icon" :style="{
              color: activeAlarmCount ? '#F56C6C' : '',
            }"></i>
          </el-badge>
          <i v-else :class="'iconfont ' + item.meta.icon"></i>
        </template>
        <template v-for="uu in item.children">
          <el-menu-item :key="uu.path" :index="uu.path" v-if="
            devicePermissions[uu.code] === undefined ||
            devicePermissions[uu.code]
          ">{{ $translate(uu.meta.name) }}</el-menu-item>
        </template>
      </el-submenu>
      <el-tooltip effect="dark" v-else :key="item.path + ''" :content="$translate(item.meta.name)"
        placement="bottom">
        <el-menu-item :index="item.path" :key="item.path">
          <i :class="'iconfont ' + item.meta.icon"></i>
        </el-menu-item>
      </el-tooltip>
    </template>
    <el-menu-item class="menu-index"
      index="/containerIndex" key="index">{{
      $translate("首页") }}</el-menu-item>
  </el-menu>
</template>

<script>
import { SubSocket } from "@/lib/socket/socketTools";
import {
  showMessage,
  redirectPath,
  getToken,
  setEncrypt,
} from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
import { apiGetPublicKey } from "@/api/user";
import { apiReset } from "@/api/device";
import { deepClone } from "@/common/utils";

const { mapGetters: user_getters } = createNamespacedHelpers("user");
const {
  mapGetters: device_getters,
  mapMutations: device_mutations,
  mapActions: device_actions,
} = createNamespacedHelpers("device");
const { mapGetters: app_getters } = createNamespacedHelpers("app");

export default {
  name: "Nav",
  data() {
    return {
      subUrl: "/ws/cmd_status_info",
      topic: "/topic/cmd_status_info/user/",
      activeIndex: "1",
      routes: [],
    };
  },
  mounted() {
    this.getDevicesCount();
    this.initRoutes();
    this.activeIndex = this.$route.path;
  },
  computed: {
    ...app_getters(["systemTheme"]),
    ...user_getters(["userInfo", "activeAlarmCount"]),
    ...device_getters(["currentDevice", "devicePermissions", "devicesCount", "version"]),
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
  },
  methods: {
    ...device_mutations(["setAllDevices", "setCurrentDevice"]),
    ...device_actions(["getDevicesCount"]),
    subscribe() {
      SubSocket(this.subUrl, this.topic, getToken(), 5, (res) => {
        this.$notify({
          title: this.$translate("执行结果"),
          message: res.msg,
          position: "bottom-right",
        });
      });
    },
    initRoutes() {
    this.routes = this.$router.options.routes[5].children;
      // console.log(this.$router.options.routes[5].children);
    },
    goReset() {
      this.$prompt(
        this.$translate("请输入密码"),
        this.$translate("恢复出厂设置"),
        {
          confirmButtonText: this.$translate("确定"),
          cancelButtonText: this.$translate("取消"),
          inputValidator: (value) => {
            if (value == null) return this.$translate("请输入密码");
          },
        }
      ).then(async ({ value: password }) => {
        let { data: key } = await apiGetPublicKey();
        if (!key) return;
        let resquestData = {
          dtuId: this.currentDevice.id,
          password: setEncrypt(key, password),
        };
        let { code } = await apiReset(resquestData);
        if (code === "ok") {
          showMessage("success", this.$translate("下发成功"));
        }
      });
    },
    handleSelect(key) {
      if (key === "/system/reset") {
        this.subscribe();
        this.goReset();
      } else {
        redirectPath(key);
      }
    },
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path;
    },
  },

};
</script>

<style scoped lang="scss">
.icon-jiankong {
  font-size: 25px !important;
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.menu-index::before {
  content: "";
  display: inline-block;
  height: 22px;
  border-left: 1px solid $text-color;
  position: absolute;
  left: 0;
  top: 18px;
}

.el-menu--horizontal {

  >.el-menu-item,
  .el-submenu {
    margin: 0 8px;

    &.is-active {
      i {
        color: $colorful-1;
      }
    }

    i {
      font-size: 17px;

      &.icon-dianchi {
        transform: rotate(-90deg);
        display: inline-block;
      }
    }
  }
}

>>>.el-badge__content.is-fixed {
  right: 8px;
  top: 21px;
}

>>>.el-badge__content {
  height: 10px;
  line-height: 10px;
  padding: 2px 3px;
}
</style>
