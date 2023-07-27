<template>
  <el-dialog
    :title="dialogObj.plantId ? $translate('编辑电站') : $translate('添加电站')"
    :visible.sync="visible"
    width="30%"
    :before-close="handleCancle"
    :append-to-body="true"
  >
    <el-form
      :model="formData"
      size="medium"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$translate('名称')" prop="name">
        <el-input
          type="text"
          v-model="formData.name"
          autocomplete="off"
          maxlength="15"
          show-word-limit
        >
        </el-input>
      </el-form-item>

      <el-form-item :label="$translate('功率')" prop="designPower">
        <el-input
          type="text"
          v-model="formData.designPower"
          autocomplete="off"
          
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translate('所属用户')" prop="userId">
        <el-select v-model="formData.userId" default-first-option="">
          <el-option
            v-for="item in commonUserList"
            :key="item.f0102_Id"
            :label="item.name"
            :value="item.f0102_Id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$translate('地址')" prop="position">
        <el-input
          type="text"
          v-model="formData.position"
          autocomplete="off"
          maxlength="65"
          show-word-limit
        >
        </el-input>
      </el-form-item>

      <el-form-item :label="$translate('经度')" prop="longitude">
        <el-input
          type="text"
          v-model="formData.longitude"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translate('纬度')" prop="latitude">
        <el-input
          type="text"
          v-model="formData.latitude"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translate('时区')" prop="timeZone">
        <el-select v-model="formData.timeZone">
          <el-option
            v-for="item in timeZone"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$translate('电站状态')" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="item in plantStatus"
            :label="item.value"
            :key="item.value"
            >{{ $translate(item.label) }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$translate('电站类型')" prop="deviceTypeId">
        <el-radio-group v-model="formData.deviceTypeId">
          <el-radio
            v-for="item in plantTypes"
            :label="item.value"
            :key="item.value"
            >{{ $translate(item.label) }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="handleSure">{{
          $translate("确定")
        }}</el-button>
        <el-button size="small" @click="handleCancle">{{
          $translate("取消")
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { plantStatus, plantTypes, timeZone } from "@/common/config";
import { apiUpdatePlant } from "@/api/plant";
import { showMessage } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: user_getters } = createNamespacedHelpers("user");
export default {
  name: "AddUser",
  data() {
    return {
      visible: false,
      plantStatus,
      plantTypes,
      timeZone,
      formData: {
        name: "",
        designPower: "",
        position: "",
        userId: "",
        latitude: "",
        longitude: "",
        timeZone: "",
        status: "",
        deviceTypeId: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$translate("请输入电站名称"),
            trigger: "blur",
          },
        ],
        designPower: [
          {
            required: true,
            message: this.$translate("请输入电站功率"),
            trigger: "blur",
          },
          {
            pattern:/^\d{1,9}$/,
            message:this.$translate("请输入正确电站功率"),
          }
        ],
        position: [
          {
            required: true,
            message: this.$translate("请输入电站地址"),
            trigger: "blur",
          },
        ],
        userId: [
          {
            required: true,
            message: this.$translate("请选择所属用户"),
            trigger: "blur",
          },
        ],
        latitude: [
          {
            required: true,
            message: this.$translate("请输入纬度"),
            trigger: "blur",
          },
          {
            pattern: /^[\-\+]?([0-8]?\d{1}(\.\d{1,6})*|90(\.0{1,6})*)$/,
            message: this.$translate("坐标格式有误"),
          },
        ],
        longitude: [
          {
            required: true,
            message: this.$translate("请输入经度"),
            trigger: "blur",
          },
          {
            pattern:
              /^[\-\+]?(0?\d{1,2}(\.\d{1,6})*|1[0-7]?\d{1}(\.\d{1,6})*|180(\.0{1,6})*)$/,
            message: this.$translate("坐标格式有误"),
          },
        ],
        timeZone: [
          {
            required: true,
            message: this.$translate("请选择时区"),
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: this.$translate("请选择电站状态"),
            trigger: "blur",
          },
        ],
        deviceTypeId: [
          {
            required: true,
            message: this.$translate("请选择电站类型"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    commonUserList: {
      type: Array,
      default: (_) => [],
    },
    dialogObj: {
      type: Object,
      default: (_) => {},
    },
  },
  methods: {
    handleCancle() {
      this.$emit("update:dialogObj", {});
      this.$refs.ruleForm.resetFields();
    },
    async handleSure() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        let { userId } = this.formData;
        let { plantId } = this.dialogObj;
        let requestData = {
          ...this.formData,
          plantId: plantId || 0,
          userId: [userId],
          installDate: plantId ? null:Date.parse(new Date()),
        };
        let { data } = await apiUpdatePlant(requestData);
        if (data) {
          showMessage(
            "success",
            plantId ? this.$translate("编辑成功") : this.$translate("添加成功")
          );
          this.$emit("e_upDateList");
        }
        this.handleCancle();
      });
    },
  },
  watch: {
    dialogObj(obj) {
      this.visible = obj.flag;
      if (obj.plantId) {
        Object.keys(this.formData).forEach((key) => {
          this.formData[key] =
            key === this.userId ? obj["f0102_Ids"][0] : obj[key];
        });
      } else {
        Object.keys(this.formData).forEach((key) => {
          this.formData[key] = "";
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
