import HttpRequest from "@/common/request";

const axios = new HttpRequest();

const apiIssueCommand = ({ requestData, topic }) =>
    axios.request({ url: `/sermatec-energy/${topic}`, method: "post", data: requestData });

const apiControlChannel = params =>
    axios.request({ url: "/sermatec-energy/ctlRead", method: "get", params });

const apiDemandControl = params =>
    axios.request({ url: "/sermatec-energy/needCtrlRead", method: "get", params });

const apiCurrentInstruction = params =>
    axios.request({ url: "/sermatec-energy/nowRunRead", method: "get", params });

const apiInstructionStatus = params =>
    axios.request({ url: "/sermatec-energy/cmdStatusRead", method: "get", params });

const apiFaultShielding_normal = params =>
    axios.request({ url: "/sermatec-energy/bugRead", method: "get", params });

const apiFaultShielding_debug = params =>
    axios.request({ url: "/sermatec-energy/debugRead", method: "get", params });

const apiLowPower = params =>
    axios.request({ url: "/sermatec-energy/debugStyleLowPowerRead", method: "get", params });

const apiBatteryDirective_sysBattery = params =>
    axios.request({ url: "/sermatec-energy/sysBatteryRead", method: "get", params });

const apiBatteryDirective_nowBattery = params =>
    axios.request({ url: "/sermatec-energy/nowBatteryRead", method: "get", params });

const apiBatteryDirective_pcs = params =>
    axios.request({ url: "/sermatec-energy/pcsRead", method: "get", params });

const apiDebugMode = params =>
    axios.request({ url: "/sermatec-energy/debugStyleRead", method: "get", params });

const apiGetIndexKeywords = params =>
    axios.request({ url: "/sermatec-energy/keywords/getIndexKeywords", method: "get", params });

const apiGetTwoMinute = params =>
    axios.request({ url: "/sermatec-energy/mCtlStrategyInfor", method: "get", params });

export {
    apiIssueCommand,
    apiControlChannel,
    apiDemandControl,
    apiCurrentInstruction,
    apiInstructionStatus,
    apiFaultShielding_normal,
    apiFaultShielding_debug,
    apiLowPower,
    apiBatteryDirective_sysBattery,
    apiBatteryDirective_nowBattery,
    apiBatteryDirective_pcs,
    apiDebugMode,
    apiGetIndexKeywords,
    apiGetTwoMinute,
};
