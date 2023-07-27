// 路由守卫 路由改变就会触发
import router from "./routes";
import store from "@/store/index";
import { getToken, removeToken, clearStore, showMessage } from "@/common/utils";
import { DisSocket } from "../lib/socket/socketTools";

// 白名单
const whiteRouter = ["/authorization"];

router.beforeEach((to, from, next) => {
  cancelAxios();
  let { path } = to;
  let redictPath;
  if (path === "/workOrder") return next();
  if (getToken()) {
    if (path == "/authorization") {
      // 退出登录 清除token 和vuex
      DisSocket()
      removeToken();
      clearStore();
      store.commit("user/setUserInfo", {});
    }
    else if (path === "/index") {
      clearStore();
      redictPath = "/containerIndex"
    }
    redictPath ? next(redictPath) : next();
  } else {
    if (whiteRouter.indexOf(path) !== -1) {
    console.log(whiteRouter);
      next(); // 必须要用 否则不会往下执行代码
      // 不带参数默认跳转到to.path 不会触发beforeEach
    } else {
      showMessage("error", "请重新登录");
      next("/authorization"); // 带参数 跳转到参数路由 会触发beforeEach
    }
  }
});

const cancelAxios = () => {
  let axiosInstanceArry = store.getters["app/axiosInstanceArry"];
  if (axiosInstanceArry.length) {
    axiosInstanceArry.forEach(item => item.cancelFn("cancel"));
  }
};

/*

1. 直接进入index的时候 触发路由守卫  to为 '/index'  执行beforeEach
2. 然后判断没有token 执行next('/user') 由于带了参数 跳转到 /user
3. 然后又触发了路由守卫 执行beforeEach 判断实在白名单中
4. 执行 next() 不带参数 不会触发路由守卫 最终停在 user 页面 不会再跳转

 */
