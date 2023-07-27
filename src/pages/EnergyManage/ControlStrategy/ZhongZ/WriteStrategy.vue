<template>
  <CommandPlane>
    <template #title>
      <span>{{ $translate("写策略运行模式设置") }}</span>
      <div>
        <el-button
          plain
          :disabled="btnParams.isDisable"
          @click="readCommand"
          size="mini"
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
      <div class="item">
        <div class="label">{{ $translate("系统运行模式") }}</div>
        <el-select size="small" v-model="mode">
          <el-option
            v-for="uu in options"
            :key="uu.value"
            :label="$translate(uu.label)"
            :value="uu.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
  </CommandPlane>
</template>

<script>
import { showMessage } from "@/common/utils";
export default {
  name: "WriteStrategy",
  data() {
    return {
      options: [
        {
          value: 0,
          label: "自动"
        },
        {
          value: 1,
          label: "停止"
        }
      ],
      mode: ""
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
      this.$emit("readCommand", {
        topic: "zhongz/strategyMode",
        requestData: {
          isWrite: false
        }
      });
    },
    issueCommand() {
      let requestData = { mode: this.mode };
      if (Object.values(requestData).includes("")) {
        return showMessage("warning", this.$translate("请填写全部字段"));
      }
      this.$emit("issueCommand", {
        requestData: {
          isWrite: true,
          ...requestData
        },
        confirmParams: [
          {
            label: this.$translate("系统运行模式"),
            value: this.mode ? this.$translate("停止") : this.$translate("自动")
          }
        ],
        topic: "zhongz/strategyMode"
      });
    }
  },
  watch: {
    result(newVal) {
      if (newVal.cmdTypeId == 3000) {
        this.mode = +newVal.mode;
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
