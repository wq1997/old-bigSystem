import { apiGetAllPlants } from "@/api/plant";
import { showMessage, setToken, redirectPath } from "@/common/utils";

const state = {
  allPlants: [],
  currentPlant: {}
};

const mutations = {
  setAllPlants(state, value) {
    state.allPlants = value;
  },
  setCurrentPlant(state, value) {
    value = JSON.parse(JSON.stringify(value))
    let { timeZone } = value
    if (timeZone) {
      value.timeZone = timeZone.split("UTC")[1]
    }
    state.currentPlant = value;
  },
};

const getters = {
  allPlants: state => state.allPlants,
  currentPlant: state => state.currentPlant,
};

const actions = {
  async getAllPlants({ commit }) {
    let { data } = await apiGetAllPlants()
    data = JSON.parse(data || '[]')
    commit('setAllPlants', data)
    commit('setCurrentPlant', data.length ? data[0] : {})
  },
};

export default {
  namespaced: true, // 命名空间
  state,
  getters,
  mutations,
  actions
};
