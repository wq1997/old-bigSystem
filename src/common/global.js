// vue 定义全局方法
import that from '@/main'
import { zh } from "@/i18n/locales/zh";

let zh_arrys = Object.entries(zh)

export default {
  install(Vue) {
    (Vue.prototype.$translate = text => {
      if (text === "" || text === undefined) return "--";
      try {
        let [key] = zh_arrys.find(item => item[1] === text);
        return that.$t(key);
      } catch (err) {
        console.log(`not found：${text}`);
        return "--";
      }
    });
  }
};
