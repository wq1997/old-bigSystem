<template>
  <div class="login animate__animated animate__flipInY">
    <div class="logo"></div>
    <el-divider content-position="center">{{
        $translate("普通版")
    }}</el-divider>
    <el-input size="medium" v-model="userName" prefix-icon="el-icon-user" :placeholder="$translate('用户名')" clearable
      @keyup.enter.native="goLogin"></el-input>
    <el-input size="medium" v-model="password" prefix-icon="el-icon-lock" :placeholder="$translate('密码')" clearable
      show-password @keyup.enter.native="goLogin"></el-input>
    <div class="code-wrapper" v-if="showCode">
      <el-input size="medium" v-model="code" prefix-icon="el-icon-key" :placeholder="$translate('验证码')" clearable
        @keyup.enter.native="goLogin"></el-input>
      <img :src="codeImgUrl" @click="changeCodeImg" />
    </div>
    <!-- <div class="text-register">
      <span @click="changeForm('register')">{{ $translate("注册") }}</span>
    </div> -->
    <el-button type="primary" size="medium" @click="goLogin">
      {{ $translate("登录") }}
    </el-button>
  </div>
</template>

<script>
import { codeImgUrl } from "@/common/config";
import {
  showMessage,
  setEncrypt,
  setToken,
  showLoading,
  closeLoading
} from "@/common/utils";
import { apiGetPublicKey } from "@/api/user";
import { createNamespacedHelpers } from "vuex";
import { baseUrl } from "@/common/config";
const { mapGetters: app_getters } = createNamespacedHelpers("app");
const { mapActions: user_actions } = createNamespacedHelpers("user");

export default {
  name: "Login",
  data() {
    return {
      userName: "",
      password: "",
      showCode: false,
      loading: true,
      code: "",
      codeImgUrl
    };
  },
  computed: {
    ...app_getters(["locale"])
  },
  methods: {
    ...user_actions(["login"]),
    changeForm(type) {
      this.$emit("changeForm", type);
    },
    changeCodeImg() {
      this.codeImgUrl = "";
      setTimeout(_ => (this.codeImgUrl = codeImgUrl), 0);
    },
    async goLogin() {
      if (this.userName === "" || this.password === "") {
        return showMessage("warning", this.$translate("请输入用户名或密码"));
      }
      if (this.showCode && this.code === "") {
        return showMessage("warning", this.$translate("请输入验证码"));
      }
      let { data: key } = await apiGetPublicKey();
      if (!key) return;
      let loginLoding = showLoading();
      // console.log(baseUrl);
      let requestData = {
        userName: this.userName,
        password: setEncrypt(key, this.password),
        remember: false,
        language: {
          zh: 1,
          zh_tw: 2,
          en: 3,
          czech: 4
        }[this.locale],
        clientType: 3
        //  ...(baseUrl.includes("192.168.6.9") && { clientType: 3 })
      };
      this.showCode &&
        Object.assign(requestData, {
          keywords: this.code
        });
      let code = await this.login(requestData);
      closeLoading(loginLoding);
      code && (this.showCode = true);
    },
  }
};
</script>

<style scoped lang="scss">
.login {
  width: 390px;
  padding: 30px;
  height: 380px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px;
  @include dis-flex(space-between, center, column);

  .logo {
    width: 180px;
    height: 20px;
    background: url("#{$img-url}logo-new.png") no-repeat;
    background-size: 100% 100%;
  }

  .el-divider--horizontal {
    margin: 10px 0;

    .el-divider__text {
      color: #999;
      font-size: 13px;
    }
  }

  .code-wrapper {
    width: 100%;
    @include dis-flex(space-between, center);

    .el-input {
      width: 220px;
    }

    img {
      width: 100px;
      height: 36px;
      cursor: pointer;
    }
  }

  .text-register {
    width: 100%;
    text-align: right;
    padding-right: 5px;
    box-sizing: border-box;

    span {
      font-size: 13px;
      cursor: pointer;

      &:hover {
        color: $primary-color;
      }
    }
  }

  .el-button {
    width: 100%;
  }
}
</style>
