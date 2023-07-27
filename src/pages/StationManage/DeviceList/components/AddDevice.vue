<template>
  <el-dialog
    :title="dialogObj.id ? $translate('编辑设备') : $translate('添加设备')"
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
      <el-form-item label="sn" prop="sn">
        <el-input
          type="text"
          v-model="formData.sn"
          autocomplete="off"
          maxlength="32"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translate('设备类型')" prop="type">
        <el-select v-model="formData.type">
          <el-option
            v-for="item in deviceTypes"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$translate('摄像头sn')" prop="lechengDeviceSN">
        <el-input
          type="text"
          v-model="formData.lechengDeviceSN"
          autocomplete="off"
          maxlength="32"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translate('所属电站')" prop="plantId">
        <el-select v-model="formData.plantId">
          <el-option
            v-for="item in allPlants"
            :key="item.plantId"
            :label="item.name"
            :value="item.plantId"
          >
          </el-option>
        </el-select>
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
import { apiDeviceType } from "@/api/device";
import { apiUpdateDevice } from "@/api/device";
import { showMessage, deepClone } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: plant_getters } = createNamespacedHelpers("plant");
const {
  mapGetters: device_getters,
  mapMutations: device_mutations,
  mapActions: device_actions,
} = createNamespacedHelpers("device");
export default {
  name: "AddUser",
  data() {
    return {
      visible: false,
      deviceTypes: [],
      formData: {
        sn: "",
        type: "",
        plantId: "",
        lechengDeviceSN:""
      },
      rules: {
        sn: [
          {
            required: true,
            message: this.$translate("请输入sn号"),
            trigger: "blur",
          },
          {
            validator: (rule, value) => {
              let regex = /^[\da-zA-Z]+$/;
              return regex.test(value)
                ? Promise.resolve()
                : Promise.reject(this.$translate("sn号格式有误"));
            },
          },
        ],
        type: [
          {
            required: true,
            message: this.$translate("请选择类型"),
            trigger: "blur",
          },
        ],
        plantId: [
          {
            required: true,
            message: this.$translate("请选择所属电站"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    dialogObj: {
      type: Object,
      default: (_) => {},
    },
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    ...device_actions(["getDevicesCount"]),

    handleCancle() {
      this.$refs.ruleForm.resetFields();
      this.$emit("update:dialogObj", {});
    },
    async getTableList() {
      let { data } = await apiDeviceType();
      this.deviceTypes = data;
    },
    async handleSure() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        let { id } = this.dialogObj;
        let requestData = {
          ...this.formData,
          id: id || 0,
          deviceTypeId:this.version==2?6:1,
        };
        let { data } = await apiUpdateDevice(requestData);
        if (data) {
          showMessage(
            "success",
            id ? this.$translate("编辑成功") : this.$translate("添加成功")
          );
          this.getDevicesCount();
          this.$emit("e_upDateList");
          this.handleCancle();
        }
      });
    },
  },
  computed: {
    ...plant_getters(["allPlants"]),
    ...device_getters(["version"]),
  },
  watch: {
    dialogObj(obj) {
      this.visible = obj.flag;
      if (obj.id) {
        Object.keys(this.formData).forEach((key) => {
          if (this.formData.hasOwnProperty(key)) {
            this.formData[key] = obj[key];
          }
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
