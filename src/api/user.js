import HttpRequest from "@/common/request";

const axios = new HttpRequest();

const apiGetPublicKey = _ =>
  axios.request({ url: "/user/getPublicKey", method: "get" });

const apiLogin = data =>
  axios.request({ url: "/user/loginWithCode", method: "post", data });

const apiGetDefaultParentNo = _ =>
  axios.request({ url: "/cloud-auth/getDefaultAgentInfo", method: "get" });

const apiRegister = data =>
  axios.request({ url: "/cloud-auth/register", method: "post", data });

const apiModifyPwd = data =>
  axios.request({ url: "/user/changePassword", method: "post", data });

const apiUserList = _ =>
  axios.request({ url: "/user/getAllUsers", method: "get", });

const apiDeleteUser = params =>
  axios.request({ url: "/user/deleteUser", method: "get", params });

const apiGetAllAdminUser = params =>
  axios.request({ url: "/user/getAllAdminUser", method: "get", params });

const apiAddUser = data =>
  axios.request({ url: "/user/updateUser", method: "post", data });

const apiUpdateUserBaseInfo = data =>
  axios.request({ url: "/user/updateUserInfo", method: "post", data });

const apiGetAllCommonUser = _ =>
  axios.request({ url: "/user/getAllCstmUser", method: "get", });


// 提交的工单列表 
const apiGetMyOrderList = params =>
  axios.request({ url: '/cloud-work-order/workOrder/getAllWorkOrderByCondition', method: "get", params });

// 需要处理的工单列表  
const apiGetDealOrderList = params =>
  axios.request({ url: '/cloud-work-order/workOrder/getAllAdminNeedDealByCondition', method: "get", params });

// 新建工单
const apiCreateOrder = data =>
  axios.request({ url: '/cloud-work-order/workOrder/createWorkOrder', method: "post", data });

// 删除工单
const apiDeleteOrder = params =>
  axios.request({ url: '/cloud-work-order/workOrder/delWorkOrder', method: "get", params });

// 结单
const apiFinishOrder = params =>
  axios.request({ url: '/cloud-work-order/workOrder/finishWorkOrder', method: "get", params });

// 获取反馈信息
const apiGetOrderFeedback = params =>
  axios.request({ url: '/cloud-work-order/comments/getWorkOrderInfoAndComments', method: "get", params });

// 添加反馈
const apiAddOrderFeedback = data =>
  axios.request({ url: '/cloud-work-order/comments/createWorkOrderComments', method: "post", data });

// 添加评价
const apiAddOrderAssess = data =>
  axios.request({ url: '/cloud-work-order/assess/createWorkOrderAssess', method: "post", data });

// 添加评价
const apiUnReadMsgCount = _ =>
  axios.request({ url: '/cloud-work-order/workOrder/getNoReadCount', method: "get" });

// 工单筛选用户下拉框
const apiOrderUserSelect = _ =>
  axios.request({ url: '/user/getAllUsersSelect', method: "get" });


// 验证用户密码
const apiVolidPassword = params =>
  axios.request({ url: '/cloud-auth/volidPassword', method: "get", params });

let pastUrl = '/pay'
// 充值 返回二维码
const apiRechargeAlipay = (params) =>
  axios.request({ url: `${pastUrl}/pay/aliPcOrder`, method: "get", params: { method: 'GET', ...params } });

const apiRechargeWechart = (params) =>
  axios.request({ url: `${pastUrl}/pay/nativepay`, method: "get", params });

// 支付结果  
const apiGetPayResult = params =>
  axios.request({ url: `${pastUrl}/pay/payment`, method: "get", params });

// 订单列表
const apiGetOrderList = params =>
  axios.request({ url: `${pastUrl}/pay/findAllByPage`, method: "get", params });

// 监控是否到期  
const apiCheckIsExpired = params =>
  axios.request({ url: `${pastUrl}/pay/DateJudgment`, method: "get", params });

// 价格类型  
const apiGetPriceType = (params) =>
  axios.request({ url: `${pastUrl}/pay/totaltype`, method: "get", params });

// 服务类型
const apiGetServerType = () =>
  axios.request({ url: `${pastUrl}/pay/service`, method: "get" });

// 告警微信二维码  
const apiGetAlarmNoticeCode = () =>
  axios.request({ url: `/wechatpublic/wx/getTicket`, method: "get" });

// 告警微信是否绑定 
const apiCheckBindStatus = () =>
  axios.request({ url: `/wechatpublic/wx/BindingState`, method: "get" });

const apiSend = () =>
  axios.request({ url: `/wechatpublic/wx/wxSend`, method: "post" });


export {
  apiGetPublicKey,
  apiLogin,
  apiGetDefaultParentNo,
  apiRegister,
  apiModifyPwd,
  apiUserList,
  apiDeleteUser,
  apiGetAllAdminUser,
  apiAddUser,
  apiUpdateUserBaseInfo,
  apiGetAllCommonUser,
  apiGetMyOrderList,
  apiGetDealOrderList,
  apiCreateOrder,
  apiDeleteOrder,
  apiFinishOrder,
  apiGetOrderFeedback,
  apiAddOrderFeedback,
  apiAddOrderAssess,
  apiUnReadMsgCount,
  apiOrderUserSelect,
  apiVolidPassword,

  apiRechargeAlipay,
  apiRechargeWechart,
  apiGetPayResult,
  apiGetOrderList,
  apiCheckIsExpired,
  apiGetPriceType,
  apiGetServerType,

  apiGetAlarmNoticeCode,
  apiCheckBindStatus,
  apiSend

};
