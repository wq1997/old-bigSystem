import HttpRequest from "@/common/request";

const axios = new HttpRequest();

// const apiGetAppNowAlarmsWithPage = params =>
//   axios.request({ url: "/sermatec-energy/getAppNowAlarmsWithPage", method: "get", params });

const apiGetAppNowAlarmsWithPage = params =>
  axios.request({ url: "/sermatec-energy/getNowAlarmsByDtuIdWithPage", method: "get", params });

const apiGetActiveAlarm = params =>
  axios.request({ url: "/sermatec-energy/getNowAlarmsByDtuIdWithPage", method: "get", params });

const apiGetHistoryAlarm = params =>
  axios.request({ url: "/sermatec-energy/getHistoryAlarmsByDtuIdWithPage", method: "get", params });

const apiGetAlarmConfig = _ =>
  axios.request({ url: "/sermatec-energy/alarmType/getAlarmTypeInfos", method: "get", });

const apiUpdateAlarmConfig = data =>
  axios.request({ url: "/sermatec-energy/alarmType/updateAlarmTypeInfos", method: "post", data });

const apiGetAlarmRules = () =>
  axios.request({ url: "/sermatec-energy/getAllAlarmRules", method: "get", });

const apiGetAlarmTypes = () =>
  axios.request({ url: "/sermatec-energy/fetchAllMinSysDesc", method: "get" });


const apiUpdateAlarmRule = data =>
  axios.request({
    url: "/sermatec-energy/updateAlarmRule",
    method: "post",
    data,
  });

const apiAddAlarmRule = data =>
  axios.request({ url: "/sermatec-energy/addAlarmRule", method: "post", data });

const apiDeleteAlarmRule = params =>
  axios.request({
    url: "/sermatec-energy/deleteAlarmRule",
    method: "get",
    params,
  });
// 集装箱报警
const apiGetAlarmsByContainerIdWithPage = params =>
  axios.request({
    url: "/energy/getAlarmsByContainerIdWithPage",
    methods: "get",
    params
  });

  // 集装箱实时报警
const apiGetNowAlarmsByContainerIdWithPage = params =>
axios.request({
  url: "energy/getNowAlarmsByContainerIdWithPage",
  methods: "get",
  params
});
export {
  apiGetNowAlarmsByContainerIdWithPage,
  apiGetAlarmsByContainerIdWithPage,
  apiGetActiveAlarm,
  apiGetHistoryAlarm,
  apiGetAlarmConfig,
  apiUpdateAlarmConfig,
  apiGetAppNowAlarmsWithPage,
  apiGetAlarmRules,
  apiGetAlarmTypes,
  apiUpdateAlarmRule,
  apiAddAlarmRule,
  apiDeleteAlarmRule
};
