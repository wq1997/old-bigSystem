<template>
  <div class="controlStrategy">
    <PasswordModal />
    <div v-if="deviceTypeId == 1 && currentDevice.type != 8">
      <ControlChannel
        :btnParams="btnParams"
        :result="result"
        @readCommand="readCommand"
        @issueCommand="issueCommand"
      />
      <DemandControl
        :btnParams="btnParams"
        :result="result"
        @readCommand="readCommand"
        @issueCommand="issueCommand"
      />
      <DailyContral :btnParams="btnParams" @issueCommand="issueCommand" />
      <MonthContral :btnParams="btnParams" @issueCommand="issueCommand" />
      <TwoMinute
        :btnParams="btnParams"
        @readCommand="readCommand"
        @issueCommand="issueCommand"
      />
      <CurrentInstruction
        :btnParams="btnParams"
        :result="result"
        @readCommand="readCommand"
      />
      <InstructionStatus
        :btnParams="btnParams"
        :result="result"
        @readCommand="readCommand"
      />
    </div>
    <div v-if="deviceTypeId == 3 && currentDevice.type != 8">
      <FaultShielding
        :btnParams="btnParams"
        :result="result"
        @readCommand="readCommand"
        @issueCommand="issueCommand"
      />
      <LowPower
        :btnParams="btnParams"
        :result="result"
        @readCommand="readCommand"
        @issueCommand="issueCommand"
      />
      <BatteryDirective
        :btnParams="btnParams"
        :result="result"
        @readCommand="readCommand"
        @issueCommand="issueCommand"
      />
      <DebugMode
        :btnParams="btnParams"
        :result="result"
        @readCommand="readCommand"
        @issueCommand="issueCommand"
      />
    </div>
    <div v-if="currentDevice.type == 8">
      <WriteStrategy
        v-if="devicePermissions['Q/A']"
        :btnParams="btnParams"
        :result="result"
        @readCommand="goIssue"
        @issueCommand="issueCommand"
      />
      <SwitchMachine
        v-if="devicePermissions['Q/B']"
        :btnParams="btnParams"
        :result="result"
        @issueCommand="issueCommand"
      />
      <ChargeDisSet
        v-if="devicePermissions['Q/C']"
        :btnParams="btnParams"
        :result="result"
        @readCommand="goIssue"
        @issueCommand="issueCommand"
      />
      <ElecTypeSet
        v-if="devicePermissions['Q/D']"
        :btnParams="btnParams"
        :result="result"
        @readCommand="goIssue"
        @issueCommand="issueCommand"
      />
      <DemandThreshold
        v-if="devicePermissions['Q/F']"
        :btnParams="btnParams"
        :result="result"
        @readCommand="goIssue"
        @issueCommand="issueCommand"
      />
      <AntiRefluxAllowance
        v-if="devicePermissions['Q/G']"
        :btnParams="btnParams"
        :result="result"
        @readCommand="goIssue"
        @issueCommand="issueCommand"
      />
      <SystemPowerSet
        v-if="devicePermissions['Q/E']"
        :btnParams="btnParams"
        :result="result"
        @readCommand="goIssue"
        @issueCommand="issueCommand"
      />
    </div>
  </div>
</template>

<script>
import { controlStrategyArr, socketSubUrlTopic } from "@/common/config";
import { SubSocket } from "@/lib/socket/socketTools";
import { apiIssueCommand } from "@/api/command";
import { showMessage, getToken } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
  name: "ControlStrategy",
  data() {
    return {
      deviceId: 0,
      deviceTypeId: 0,
      btnParams: {
        readBtnText: this.$translate("读取"),
        issueBtnText: this.$translate("下发"),
        isDisable: false
      },
      result: {},
      password: "",
      dialogVisible: true
    };
  },
  created() {
    let { id, deviceTypeId } = this.currentDevice;
    this.deviceId = id;
    this.deviceTypeId = deviceTypeId;
    let { subUrl, topic } = socketSubUrlTopic.controlStrategy;
    SubSocket(subUrl, topic, getToken(), controlStrategyArr, res => {
      console.log(res);
      let { code, msg } = res;
      this.$notify({
        title: this.$translate("执行结果"),
        message: msg,
        position: "bottom-right"
      });
      if (code === "ok" && res.data) {
        console.log(JSON.parse(res.data));
        this.result = JSON.parse(res.data);
      }
    });
  },
  components: {
    PasswordModal: _ => import("@/components/PasswordModal"),
    // 大系统
    ControlChannel: _ => import("./BS/ControlChannel"),
    DemandControl: _ => import("./BS/DemandControl"),
    DailyContral: _ => import("./BS/DailyContral"),
    MonthContral: _ => import("./BS/MonthContral"),
    TwoMinute: _ => import("./BS/TwoMinute"),
    CurrentInstruction: _ => import("./BS/CurrentInstruction"),
    InstructionStatus: _ => import("./BS/InstructionStatus"),
    // 小高压
    FaultShielding: _ => import("./SH/FaultShielding"),
    LowPower: _ => import("./SH/LowPower"),
    BatteryDirective: _ => import("./SH/BatteryDirective"),
    DebugMode: _ => import("./SH/DebugMode"),
    // 中哲
    WriteStrategy: _ => import("./ZhongZ/WriteStrategy"),
    DemandThreshold: _ => import("./ZhongZ/DemandThreshold"),
    AntiRefluxAllowance: _ => import("./ZhongZ/AntiRefluxAllowance"),
    SwitchMachine: _ => import("./ZhongZ/SwitchMachine"),
    ElecTypeSet: _ => import("./ZhongZ/ElecTypeSet"),
    ChargeDisSet: _ => import("./ZhongZ/ChargeDisSet"),
    SystemPowerSet: _ => import("./ZhongZ/SystemPowerSet")
  },
  computed: {
    ...device_getters(["currentDevice", "devicePermissions"])
  },
  methods: {
    countDownTime() {
      let number = 10;
      this.btnParams = {
        readBtnText: number,
        issueBtnText: number,
        isDisable: true
      };
      let instance = setInterval(_ => {
        number -= 1;
        this.btnParams = {
          readBtnText: number,
          issueBtnText: number,
          isDisable: true
        };
        if (number === 0) {
          clearInterval(instance);
          this.btnParams = {
            readBtnText: this.$translate("读取"),
            issueBtnText: this.$translate("下发"),
            isDisable: false
          };
        }
      }, 1000);
    },
    async readCommand(fn) {
      this.countDownTime();
      let dtuId = this.currentDevice.id;
      let { code } = await fn({ dtuId });
      code === "ok" && showMessage("success", this.$translate("下发成功"));
    },
    async goIssue(issusParams) {
      this.countDownTime();
      issusParams.requestData.dtuId = this.currentDevice.id;
      let { code } = await apiIssueCommand(issusParams);
      code === "ok" && showMessage("success", this.$translate("下发成功"));
    },
    issueCommand(issusParams) {
      if (issusParams.confirmParams) {
        this.$confirm(
          <div>
            {issusParams.confirmParams.map(item => (
              <div
                style={{
                  marginBottom: "3px",
                  wordBreak: "break-all"
                }}
              >
                {item.label}：{item.value}
              </div>
            ))}
          </div>,
          this.$translate("确认下发参数"),
          {
            distinguishCancelAndClose: true,
            cancelButtonText: this.$translate("取消"),
            confirmButtonText: this.$translate("确定")
          }
        )
          .then(() => {
            this.goIssue(issusParams);
          })
          .catch(action => {
            this.$message({
              type: "info",
              message: this.$translate("已取消")
            });
          });
      } else {
        this.goIssue(issusParams);
      }
    }
  }
};
</script>
