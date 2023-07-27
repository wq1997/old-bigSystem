import HttpRequest from '@/common/request';

const axios = new HttpRequest();

// 小机

const apiGetPlantsByUserId = params =>
  axios.request({ url: '/sermatec-energy/getUserPlantSelect', method: 'get',params });

const apiGetAllPlants = _ =>
  axios.request({ url: '/sermatec-energy/getPlantList', method: 'get' });

const apiGetElectricityValue = params =>
  axios.request({
    url: '/minsys/fetchEnergyInfoByPlantId',
    method: 'get',
    params,
  });

const apiGetElectricityCharts = params =>
  axios.request({
    url: '/minsys/fetchEnergyInfoGraphByPlantId',
    method: 'get',
    params,
  });

const apiGetWarnCount = params =>
  axios.request({
    url: '/sermatec-energy/getAlarmCountByPlantId',
    method: 'get',
    params,
  });

const apiGetProfitCount = params =>
  axios.request({ url: '/minsys/pvProfitByPlantId', method: 'get', params });

const apiDeletePlant = params =>
  axios.request({ url: '/energy/deletePlant', method: 'get', params });

const apiUpdatePlant = data =>
  axios.request({ url: '/energy/updatePlant', method: 'post', data });

// 大机
const apiGetDailyDisCharge = _ =>
  axios.request({ url: '/energy/getDailyDisCharge', method: 'get' });

const apiGetPrChart = _ =>
  axios.request({ url: '/energy/getPR', method: 'get' });

const apiGetTrendChart = _ =>
  axios.request({ url: '/energy/getMonthlyElecticTrend', method: 'get' });

const apiGetPlanChart = _ =>
  axios.request({ url: '/energy/getElecticPlan', method: 'get' });

export {
  apiGetPlantsByUserId,
  apiGetAllPlants,
  apiGetElectricityValue,
  apiGetElectricityCharts,
  apiGetWarnCount,
  apiGetProfitCount,
  apiDeletePlant,
  apiUpdatePlant,
  apiGetDailyDisCharge,
  apiGetPrChart,
  apiGetTrendChart,
  apiGetPlanChart,
};
