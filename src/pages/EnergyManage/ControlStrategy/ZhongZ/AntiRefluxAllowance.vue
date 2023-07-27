<template>
  <CommandPlane>
    <template #title>
      <span>{{ $translate("变压器防逆流安全余量设置") }}</span>
      <div>
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
      <div v-for="(item, index) in params" :key="index" class="item">
        <div class="label">{{ $translate(item.label) }} (/kW)</div>
        <el-input
          size="small"
          type="number"
          v-model="item.value"
          autocomplete="off"
        ></el-input>
      </div>
    </div>
  </CommandPlane>
</template>

<script>
import { showMessage } from "@/common/utils";
export default {
  name: "AntiRefluxAllowance",
  data() {
    return {
      params: [
        {
          label: "变压器防逆流安全余量",
          type: "input",
          key: "antiRefluxAllowance",
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
      this.$emit("issueCommand", {
        requestData: {
          isWrite: false
        },
        topic: "zhongz/margin"
      });
    },
    issueCommand() {
      let requestData = {};
      this.params.forEach(({ key, value }) => (requestData[key] = value));
      if (Object.values(requestData).includes("")) {
        return showMessage("warning", this.$translate("请填写全部字段"));
      }
      let { antiRefluxAllowance } = requestData;
      if (
        isNaN(Number(antiRefluxAllowance)) ||
        antiRefluxAllowance > 100 ||
        antiRefluxAllowance < 20
      ) {
        return showMessage(
          "warning",
          this.$translate("请设置范围在") + " [20,100]"
        );
      }
      this.$emit("issueCommand", {
        requestData: {
          isWrite: true,
          ...requestData
        },
        confirmParams: this.params,
        topic: "zhongz/margin"
      });
    }
  },
  watch: {
    result(newVal) {
      if (newVal.cmdTypeId == 3006) {
        this.params.forEach(item => {
          item.value = newVal[item.key];
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  @include dis-flex(flex-end);
  width: 25%;
  margin-bottom: 20px;
  .label {
    width: 100px;
    text-align: right;
    margin-right: 8px;
  }
  .el-input,
  .el-select {
    width: calc(100% - 120px);
  }
}
</style>
