<template>
  <el-drawer
    :title="updateRow.id==0?'默认规则':'编辑规则'"
    :visible.sync="visible"
    direction="rtl"
    @close="close"
  >
    <el-form
      size="mini"
      label-position="right"
      label-width="150px"
      :model="formData"
      ref="ruleForm"
      :rules="rules"
    >
      <el-form-item label="告警类型" prop="almTypeId">
        <el-select v-model="formData.almTypeId" placeholder="请选择">
          <el-option
            v-for="item in typesArr"
            :key="item.id"
            :value="item.id"
            :label="item.desc"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="每小时推送上限" prop="initNum">
        <el-input-number  controls-position="right" :min="0" :precision="0" :max="3" v-model="formData.initNum"></el-input-number>
      </el-form-item>
      <el-form-item label="每日推送上限" prop="maxNum">
        <el-input-number controls-position="right" :min="0" :max="5" v-model="formData.maxNum"></el-input-number>
      </el-form-item>
      <el-form-item label="推送方式" prop="pushTypeIds">
        <el-checkbox-group v-model="formData.pushTypeIds">
          <el-checkbox
            v-for="item in methods"
            :label="+item.value"
            :key="item.value"
            >{{ item.desc }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
          v-model="formData.status"
          active-text="启用"
          inactive-text="禁用"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="接收人" prop="userIds">
        <el-select v-model="formData.userIds" multiple placeholder="请选择">
          <el-option
            v-for="item in commonUsers"
            :key="item.f0102_Id"
            :value="item.f0102_Id"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="close()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import { apiGetAllCommonUser } from "@/api/user";
import {
  apiGetAlarmConfig,
  apiUpdateAlarmRule,
  apiAddAlarmRule
} from "@/api/alarm";
import { deepCopy, showMessage, isEmptyObject } from "@/common/utils";
import { apiGetIndexKeywords } from "@/api/command";
export default {
  props: {
    updateRow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      direction: "rtl",
      typesArr: [],
      commonUsers: [],
      methods: [],
      formData: {
        almTypeId: "",
        initNum: "",
        maxNum: "",
        pushTypeIds: [],
        status: false,
        userIds: []
      },
      rules: {
        almTypeId: [
          { required: true, message: "请选择告警类型", trigger: "blur" }
        ],
        initNum: [
          { required: true, message: "请输入每小时推送上限", trigger: "blur" },
        ],
        maxNum: [
          { required: true, message: "请输入每日推送上限", trigger: "blur" }
        ],
        pushTypeIds: [
          { required: true, message: "请选择推送方式", trigger: "blur" }
        ],
        userIds: [{ required: true, message: "请选择接收人", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getMethods();
    this.getAllCommonUser();
    this.getAlarmTypes();
  },
  methods: {
    async getMethods() {
      let { data } = await apiGetIndexKeywords({ code: "Z1" });
      if (data) {
        // this.methods = data.filter(item => item.value != "2");
        this.methods = data;
      }
    },
    async getAllCommonUser() {
      let { data } = await apiGetAllCommonUser();
      this.commonUsers = JSON.parse(data || "[]");
    },
    async getAlarmTypes() {
      let { data } = await apiGetAlarmConfig();
      this.typesArr = data;
    },
    close() {
      this.resetForm("ruleForm");
      this.$emit("close");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let reqData = deepCopy(this.formData),
            { id, status } = reqData,
            fn = id ? apiUpdateAlarmRule : apiAddAlarmRule;
          reqData.status = +status;
          let { code } = await fn(reqData);
          if (code === "ok") {
            showMessage(
              "success",
              id ? this.$translate("编辑成功") : this.$translate("添加成功")
            );
            this.$emit("close");
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  watch: {
    updateRow(newVal) {
      this.formData = {
        ...this.formData,
        ...newVal,
        status: Boolean(newVal.status)
      };
      this.visible = !isEmptyObject(newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.el-form-item__label {
  color: #fff !important;
}
</style>
