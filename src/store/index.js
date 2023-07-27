import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import app from "./modules/app";
import user from "./modules/user";
import plant from "./modules/plant";
import device from "./modules/device";

export default new Vuex.Store({
  strict: process.env.NODE_ENV === "development",
  modules: {
    app,
    user,
    plant,
    device,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
});
