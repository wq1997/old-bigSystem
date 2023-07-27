<template>
  <el-form
    :model="formData"
    size="medium"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item :label="$translate('用户名')" prop="name">
      <el-input
        type="text"
        v-model.trim="formData.name"
        show-word-limit
        autocomplete="off"
        maxlength="65"
      ></el-input>
    </el-form-item>

    <el-form-item :label="$translate('手机号')" prop="phone">
      <el-input
        type="text"
        v-model="formData.phone"
        autocomplete="off"
      ></el-input>
    </el-form-item>

    <el-form-item :label="$translate('邮箱')" prop="mail">
      <el-input
        type="text"
        v-model="formData.mail"
        autocomplete="off"
      ></el-input>
    </el-form-item>

    <el-form-item :label="$translate('系统角色')" prop="roleName">
      <el-input
        type="text"
        disabled
        v-model="formData.roleName"
        autocomplete="off"
      ></el-input>
    </el-form-item>

    <el-form-item label="logo">
      <el-upload
        class="avatar-uploader"
        :action="uploadLogoUrl"
        :data="uploadData"
        :headers="headers"
        :on-success="upLoadSuccess"
      >
        <div class="logo">
          <img :src="userInfo.headImg" alt="" />
        </div>
        <span slot="tip">{{ $translate("点击图片上传，大小不超过 1MB") }}</span>
      </el-upload>
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
</template>

<script>
import { uploadLogoUrl } from "@/common/config";
import { apiUpdateUserBaseInfo } from "@/api/user";
import { showMessage, getToken, removeToken } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: user_getters, mapMutations: user_mapMutations } =
  createNamespacedHelpers("user");
export default {
  name: "BaseInfo",
  data() {
    return {
      formData: {
        name: "",
        phone: "",
        mail: "",
        roleName: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$translate("请输入用户名"),
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: this.$translate("请输入手机号码"),
            trigger: "blur",
          },
          {
            pattern:
              /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
            message: this.$translate("请输入正确手机号"),
            trigger: "blur",
          },
        ],
        mail: [
          {
            required: true,
            message: this.$translate("请输入邮箱"),
            trigger: "blur",
          },
          {
            type: "email",
            trigger: "blur",
            message: this.$translate("邮箱格式不正确"),
          },
        ],
      },
      uploadLogoUrl,
      uploadData: {},
      headers: {},
    };
  },
  mounted() {
    let { userId } = this.userInfo;
    this.uploadData.userId = userId;
    this.headers.token = getToken();
    this.initForm();
  },
  methods: {
    ...user_mapMutations(["setUserInfo"]),
    initForm() {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = this.userInfo[key];
      });
    },
    handleCancle() {
      this.initForm();
    },
    async handleSure() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.formData = {
          ...this.formData,
          F0102_Id: this.userInfo.f0102_Id,
        };
        let { data } = await apiUpdateUserBaseInfo(this.formData);
        if (data) {
          removeToken();
          this.$router.push("/authorization");
          showMessage("success", this.$translate("保存成功,请重新登录"));
        }
      });
    },
    upLoadSuccess(res) {
      if (res.msg) {
        showMessage("error", res.msg);
      } else {
        showMessage("success", this.$translate("上传成功"));
        let { headImg } = JSON.parse(res.data);
        this.setUserInfo({
          ...this.userInfo,
          headImg,
        });
      }
    },
  },
  computed: {
    ...user_getters(["userInfo"]),
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.logo {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 10px;
  margin-right: 10px;
  line-height: 1;

  img {
    width: 180px;
    height: 70px;
  }
}
</style>
