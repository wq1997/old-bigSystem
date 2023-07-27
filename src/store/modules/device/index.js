import { apiGetContainerTableData, apigetHistoricalSummary, apiQueryDev, apiQueryDevice, apiGetSummary, apiGetAllDevices, apiGetDeviceCount, apiDevicePermissions, apiGetContainer } from "@/api/device";

const state = {
  devicesCount: 0,
  allDevices: [],
  currentDevice: {},
  devicePermissions: {},
  version: 1,
  container: {},
  PCS: [],
  BMC: [],
  BMS: [],
  SENSOR: [],
  type: '',
  allDevDetails: [],
  queryDeviceData: [],
  tableData: []
};

const mutations = {
  setAllDevices(state, value) {
    state.allDevices = value;
  },
  setCurrentDevice(state, value) {
    sessionStorage.setItem("currentDevice", JSON.stringify(value));
    state.currentDevice = value;
  },
  setDevicesCount(state, value) {
    state.devicesCount = value;
  },
  setDevicePermissions(state, value) {
    state.devicePermissions = value;
  },
  setVersion(state, value) {
    state.version = value;
  },
  setContainer(state, value) {
    state.container = value;
  },
  setPcs(state, value) {
    state.PCS = value;
  },
  setBmc(state, value) {
    state.BMC = value;
  },
  setBms(state, value) {
    state.BMS = value;
  },
  setSensor(state, value) {
    state.SENSOR = value;
  },
  setType(state, value) {
    state.type = value;
  },
  setAllDevDetails(state, value) {
    state.allDevDetails = value;
  },
  setQueryDeviceData(state, value) {
    state.queryDeviceData = value;
  },
  setTableData(state, value) {
    state.tableData = value;
  }
};

const getters = {
  allDevices: state => state.allDevices,
  currentDevice: state => state.currentDevice,
  devicesCount: state => state.devicesCount,
  devicePermissions: state => state.devicePermissions,
  version: state => state.version,
  container: state => state.container,
  PCS: state => state.PCS,
  BMC: state => state.BMC,
  BMS: state => state.BMS,
  SENSOR: state => state.SENSOR,
  type: state => state.type,
  allDevDetails: state => state.allDevDetails,
  queryDeviceData: state => state.queryDeviceData,
  tableData: state => state.tableData,
};

const actions = {
  async getAllDevices({ commit }, requestData) {
    let { data, version } = await apiGetAllDevices(requestData);
    data = version ? data : JSON.parse(data || "[]");
    commit("setAllDevices", data);
    commit("setVersion", version);
    sessionStorage.setItem('version', version);
  },
  async getDevicesCount({ commit }) {
    let { data } = await apiGetDeviceCount();
    data = JSON.parse(data || "[]");
    commit("setDevicesCount", data.length);
  },
  async getDevicePermissions({ commit }, requestData) {
    if (requestData.type == 0) return commit("setDevicePermissions", {});
    let { data } = await apiDevicePermissions(requestData)
    if (data) {
      let { modules } = JSON.parse(data)
      let permissions = {}
      modules.forEach(item => {
        permissions[item.code] = item.show
        permissions[item.code + '-' + item.name] = item.show
        if (item.subModules) {
          item.subModules.forEach(uu => {
            permissions[uu.code] = uu.show
            permissions[uu.code + '-' + uu.name] = uu.show
          })
        }
      });
      commit("setDevicePermissions", permissions);
    } else {
      commit("setDevicePermissions", {});
    }
  },
  async getContainer({ commit }, requestData) {
    let { data } = await apiGetContainer(requestData);
    commit("setType", '');
    let [{ PCS = {} }, { BMS = {} }, { SENSOR = {} }, { BMC = {} }, { type }] = data;
    commit("setContainer", data);
    commit("setType", type);
    commit("setPcs", PCS);
    commit("setBms", BMS);
    commit("setBmc", BMC);
    commit("setSensor", SENSOR);

  },
  async getTableData({ commit },) {
    let { data } = await apiGetContainerTableData({
      containerId: sessionStorage.getItem("containerId"),
    })
    commit("setTableData", data);
  },
  async getSummary({ commit }, requestData) {
    let { data } = await apiGetSummary(requestData);
    commit("setAllDevDetails", data);
  },
  async queryDevice({ commit }, requestData) {
    let { data } = await apiQueryDevice(requestData);
    commit("setQueryDeviceData", data);
  },
  async queryDevData({ commit }, requestData) {
    let { data } = await apiQueryDev(requestData);
    commit("setAllDevDetails", data);
  },
  async getHistoricalSummary({ commit }, requestData) {
    let { data } = await apigetHistoricalSummary(requestData);
    commit("setAllDevDetails", data);
  },

};

export default {
  namespaced: true, // 命名空间
  state,
  getters,
  mutations,
  actions
};
