import Vue from "vue";
import App from "./App";
import router from "./router";

import "animate.css";
import "@/assets/styles/reset.scss";

// iconfont
import "@/assets/icon/iconfont.css";
import "@/assets/icon/iconfont.js";

// element
import ElementUI from "element-ui";
import "@/assets/styles/element.variables.scss";
import "@/assets/styles/element.component.scss/index.scss";
import locale from "element-ui/lib/locale/lang/en";

import store from "./store"; // vuex

/* echarts */
import echarts from "echarts";

Vue.prototype.$echarts = echarts;
import ECharts from "vue-echarts";

Vue.component("chart", ECharts);

import i18n from "./i18n"; // 国际化

import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);

// 注入全局方法
import globla from "@/common/global";

//图片预览
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";

Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: "data-source"
  }
});

Vue.use(ElementUI, { locale });
Vue.use(Viewer);
Vue.use(globla);

Vue.config.productionTip = false;

export default new Vue({
  el: "#app",
  router,
  store,
  i18n,
  components: { App },
  template: "<App/>"
});
