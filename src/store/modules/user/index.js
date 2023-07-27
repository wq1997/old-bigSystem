import { apiLogin, apiUserList } from "@/api/user";
import { showMessage, setToken, redirectPath } from "@/common/utils";
import { socketSubUrlTopic } from "@/common/config";
import { SubSocket } from "@/lib/socket/socketTools";
import { apiGetAppNowAlarmsWithPage } from "@/api/alarm";
import moment from 'moment'
import Vue from "@/main";

export const nowTime = (count, format) => {
  return moment().add(count, "days")
    .format(format);
};

const state = {
  userInfo: {},
  allUsers: [],
  activeAlarmCount: 0
};

const mutations = {
  setUserInfo(state, value) {
    state.userInfo = value;
  },
  setAllUsers(state, value) {
    state.allUsers = value;
  },
  setActiveAlarmCount(state, value) {
    state.activeAlarmCount = value;
  }
};

const getters = {
  userInfo: state => state.userInfo,
  allUsers: state => state.allUsers,
  activeAlarmCount: state => state.activeAlarmCount
};

const actions = {
  async login({ commit, dispatch }, requestData) {
    let { code, data } = await apiLogin(requestData);
    console.log(data);
    if (code === "407") {
      return code;
    }
    if (data) {
      commit("setUserInfo", data);
      setToken(data.token);
      dispatch({
        type: "subscribeAlarm"
      });
      showMessage("success", Vue.$translate("登录成功"));
      redirectPath('/containerIndex');
    }
  },
  async getAllUsers({ commit }) {
    let { data } = await apiUserList();
    commit("setAllUsers", JSON.parse(data || "[]"));
  },
  subscribeAlarm({ dispatch, getters }) {
    let { userId } = getters["userInfo"];
    if (!userId) return;
    let { subUrl, topic } = socketSubUrlTopic.alarm;
    SubSocket(subUrl, topic, userId, "", res => {
      dispatch("getActiveCount");
    });
  },
  async getActiveCount({ commit }) {
    if (!sessionStorage.getItem("currentDevice")) return;
    let { id } = JSON.parse(sessionStorage.getItem("currentDevice"))
    if (!id) return;
    this.loading = true;
    let requestData = {
      dtuId: id,
      start: nowTime(-7, "YYYY-MM-DD"),
      currentPage: 1,
      pageSize: 10,
      end: nowTime(0, "YYYY-MM-DD")
    };
    let { data } = await apiGetAppNowAlarmsWithPage(requestData);
    if (data) {
      let { total } = data
      commit("setActiveAlarmCount", total);
    } else {
      commit("setActiveAlarmCount", 0);
    }
  },
};

export default {
  namespaced: true, // 命名空间
  state,
  getters,
  mutations,
  actions
};
