<template>
  <CommandPlane>
    <template #title>
      <span>{{ $translate("电池指令") }}</span>
      <div>
        <el-select v-model="mode" size="mini">
          <el-option
            v-for="item in modeList"
            :key="item.value"
            :label="$translate(item.label)"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          plain
          size="mini"
          @click="readCommand"
          :disabled="btnParams.isDisable"
          >{{ btnParams.readBtnText }}</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="issueCommand"
          :disabled="btnParams.isDisable"
          >{{ btnParams.issueBtnText }}</el-button
        >
      </div>
    </template>
    <div slot="content">
      <div>
        <el-checkbox
          v-for="(item, index) in checkboxList"
          :key="index"
          v-model="item.check"
          >{{ index }} - {{ item.label }}</el-checkbox
        >
      </div>
      <div v-for="(item, index) in params" :key="index" class="item">
        <span>{{ $translate(item.label) }}：</span>
        <el-input
          size="small"
          type="text"
          v-model="item.value"
          autocomplete="off"
        ></el-input>
      </div>
    </div>
  </CommandPlane>
</template>

<script>
import {
  apiBatteryDirective_sysBattery,
  apiBatteryDirective_nowBattery,
  apiBatteryDirective_pcs
} from "@/api/command";
import { showMessage } from "@/common/utils";
export default {
  name: "BatteryDirective",
  data() {
    return {
      modeList: [
        { value: 1, fn: apiBatteryDirective_sysBattery, label: "系统电池" },
        { value: 2, fn: apiBatteryDirective_nowBattery, label: "当前电池" },
        { value: 3, fn: apiBatteryDirective_pcs, label: "PCS" }
      ],
      mode: 1,
      checkboxList: [
        { label: "强制吸合", key: "ioImpose", check: false },
        { label: "系统控制", key: "ioSysCom", check: false },
        { label: "低功耗", key: "lowPower", check: false },
        { label: "风扇开启", key: "fanControl", check: false },
        { label: "即将充电", key: "toCharge", check: false },
        { label: "即将放电", key: "toDischarge", check: false },
        { label: "复位指令", key: "resetEnable", check: false },
        { label: "绝缘监测", key: "insuCalcEnable", check: false },
        { label: "PCS通讯进低功耗", key: "pcsComLowPower", check: false },
        { label: "校准SOC使能", key: "socCheckFlag", check: false }
      ],
      params: [
        {
          label: "运行时间",
          key: "sysRunTime",
          value: ""
        },
        {
          label: "校准SOC",
          key: "socAverage",
          value: ""
        }
      ]
    };
  },
  props: {
    btnParams: {
      type: Object,
      default: _ => {}
    },
    result: {
      type: Object,
      default: _ => {}
    }
  },
  components: {
    CommandPlane: _ => import("../components/CommandPlane")
  },
  methods: {
    readCommand() {
      let { fn } = this.modeList.find(item => item.value === this.mode);
      this.$emit("readCommand", fn);
    },
    issueCommand() {
      let faultFlags = [];
      this.checkboxList.forEach(v => faultFlags.push(v.check ? 1 : 0));
      this.$emit("issueCommand", {
        requestData: { faultFlags },
        topic: "lowPowerWrite"
      });
    }
  },
  watch: {
    result(newVal) {
      if (newVal.cmdTypeId === 2001) {
        this.checkboxList.forEach(v => (v.check = Boolean(newVal[v.key])));
        this.params.forEach(item => {
          item.value = newVal[item.key];
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin-bottom: 20px;
}
.item {
  @include dis-flex(flex-start, center);
  width: 25%;
  margin-bottom: 20px;
  .el-input,
  .el-select {
    width: calc(100% - 150px);
  }
}
</style>
