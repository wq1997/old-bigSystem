<template>
  <div class="sider">
    <div class="logoTitle" :style="{ 'opacity': !toggleSideBar ? '1' : '0' }">
      <Brand />
    </div>
    <el-menu :default-active="activePathFn" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      :collapse="toggleSideBar" :collapse-transition=true :text-color="menuStyle.menuTextColor"
      :active-text-color="colorful.colorful_1" :background-color="menuStyle.menuBg" @select="handleSelect">
      <el-menu-item key="/containerIndex" index="/containerIndex">
        <i :class="'iconfont ' + 'icon-shouye'"></i>
        <span slot="title">{{ $translate("首页") }}</span></el-menu-item>
      <template v-for="(item, index) in routes">
        <el-menu-item :key="item.path" :index="item.path" v-if="!item.children">
          <i :class="'iconfont ' + item.meta.icon"></i>
          <span slot="title">{{ $translate(item.meta.name) }}</span>
        </el-menu-item>
        <!-- <el-menu-item :key="item.path" :index="item.path"
          v-if="item.meta.name === '设备舱列表' && $route.path !== '/containerIndex'">
          <i :class="'iconfont ' + item.meta.icon"></i>
          <span slot="title">{{ $translate(item.meta.name) }}</span></el-menu-item> -->
        <el-submenu :index="item.path" v-if="item.children || item.meta.name !== '设备舱列表'" :key="item.path">
          <template slot="title">
            <i :class="'iconfont ' + item.meta.icon"></i>
            <span>{{ $translate(item.meta.name) }}</span>
          </template>
          <template v-for="(uu, i) in item.children" v-if=" uu.meta.name!=='设备舱详情'">
            <el-menu-item :key="uu.path+i" :index="uu.path" v-if="devicePermissions[uu.code] === undefined ||
              devicePermissions[uu.code]
              ">{{ $translate(uu.meta.name) }}</el-menu-item>
          </template>
          <template v-if="index == 0" >
          <template v-for="(uu,ii) in bothBP">
          <el-menu-item v-if="uu.type==1"  :key="uu.id"
          :class="$route.query.id==uu.id ? 'is-active':''"
           :index="uu.path+'?id='+uu.id">{{  uu.meta.name}}</el-menu-item>
          </template>
          <template v-for="(uu,ii) in bothBP">
          <el-menu-item v-if="uu.type==2" 
          :class="$route.query.id==uu.id ? 'is-active':''"
           :key="uu.id" :index="uu.path+'?id='+uu.id">{{  uu.meta.name}}</el-menu-item>
          </template>
          <template v-for="(uu,ii) in bothBP">
          <el-menu-item v-if="uu.type==3"  :key="uu.id" 
          :class="$route.query.id==uu.id ? 'is-active':''"
          :index="uu.path+'?id='+uu.id">{{  uu.meta.name}}</el-menu-item>
          </template>
          </template>
      
        </el-submenu>

      </template>
    </el-menu>
  </div>
</template>
  
<script>
  
import { createNamespacedHelpers } from "vuex";
import { redirectPath, deepClone } from "@/common/utils";
import colorful from "@/assets/styles/config.scss";
const { mapGetters: user_getters } = createNamespacedHelpers("user");
const { mapMutations: app_mutations, mapGetters: app_getters } =
  createNamespacedHelpers("app");
const { mapGetters: device_getters, mapActions: device_actions } =
  createNamespacedHelpers("device");
  
export default {
  name: "Sider",
  data() {
    return {
      routes: [],
      bothBP: [],

    };
  },
  computed: {
    ...app_getters(["toggleSideBar", "systemTheme"]),
    ...device_getters(["devicesCount", "devicePermissions", "version", "container", "allDevices"]),
    colorful() {
      return colorful;
    },
    menuStyle() {
      let lightTheme = {
        menuTextColor: "#000",
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
    Brand: (_) => import("@/components/Brand"),

  },
  mounted() {
    this.initRoutes();
  },
  methods: {
    ...app_mutations(["set_toggleSideBar"]),
  ...device_actions(['getContainer','getTableData']),
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
    initRoutes() {
      this.bothBP=[];
      let pcsIndex=0;
        let bmsIndex=0;
        let pcsAndBms=0;
      this.routes = deepClone(this.$router.options.routes[4].children);
      this.allDevices.forEach((item) => {
        let arr = {};
        
        if (item.type == 1) {
          pcsIndex++;
          arr = {
            id:item.id,
            type: item.type,
            path: "/containerIndex/equipmentOverview",
            meta: {
              name: `${pcsIndex}#PCS`,
              icon: "icon-chanpinzonglan"
            },
            component: _ =>
              import(
              /* webpackChunkName: "Overview" */ "@/pages/containerDetail/Index"
              ),
          }
        } else if (item.type == 2) {
          bmsIndex++;
          arr = {
            id:item.id,
            type: item.type,
            path: "/containerIndex/equipmentOverview",
            meta: {
              name: `${bmsIndex}#BMS`,
              icon: "icon-chanpinzonglan"
            },
            component: _ =>
              import(
              /* webpackChunkName: "Overview" */ "@/pages/containerDetail/Index"
              ),
              
          }
       
        } else if (item.type == 3) {
          pcsAndBms++;
          arr = {
            id:item.id,
            type: item.type,
            path: "/containerIndex/equipmentOverview",
            meta: {
              name: `${pcsAndBms}#PCS&BMS`,
              icon: "icon-chanpinzonglan"
            },
            component: _ =>
              import(
              /* webpackChunkName: "Overview" */ "@/pages/containerDetail/Index"
              ),
          }
      
        }
        this.bothBP.push(arr);
      });
    },
    handleSelect(key) {
     let id=key.split('?id=')[1];
        key=key.split('?id=')[0];
      if (key=="/containerIndex/equipmentOverview") {
        sessionStorage.setItem('containerId',id);
        this.getTableData();
        this.getContainer({
          containerId:id
        }).then(()=>{
          this.$router.push({
                    path: key, 
                    query: {
                        id,
                    }
                })
        });
      }else{
        this.$router.push(key)
      }

      
    },
  },
  watch:{
  $route(to,from){
  }
},
};
</script>
<style lang="scss" scoped>
.el-menu {
  border-right: none !important;
  height: 100%;
  .el-menu-item,
  .el-submenu {
    text-align: left;
    span {
      display: inline-block;
      width: 56px;
      margin-left: 6px;
      }

  }

}

.el-submenu /deep/ .el-submenu__title,
.el-menu-item {
  height: 60px;
  line-height: 60px;
  font-size: 18px;
}

.is-active {
  color: #3af3a7 !important;
}
.iconfont {
  font-size: 26px;
}

.logoTitle {
  width: 100%;
  height: 100px;
  @include dis-flex(center, center, row);
  transition: opacity 0.5s;

}
</style>
  