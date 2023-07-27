<template>
  <div class="authorization">
    <Header></Header>
    <Login v-show="formType === 'login'" v-on:changeForm="changeForm"></Login>
    <Register
      v-show="formType === 'register'"
      v-on:changeForm="changeForm"
    ></Register>
    <span class="auth"
      >{{ $translate("上海采日能源科技有限公司 - 沪ICP备") }}
      <a
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=17053140"
        target="_blank"
        >17053140 {{ $translate("号") }}</a
      >
    </span>
    <div class="go">
      {{ $translate("登录光储一体机监控系统 请前往") }}
      <div class="address">
        <a href="https://ess.sermatec-cloud.com"
          >https://ess.sermatec-cloud.com</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";

export default {
  name: "Authorization",
  data() {
    return {
      formType: "login"
    };
  },
  components: {
    Header,
    Login,
    Register
  },
  methods: {
    changeForm(type) {
      this.formType = type;
    }
  }
};
</script>

<style scoped lang="scss">
.authorization {
  height: 100vh;
  background: #0d2133 url("#{$img-url}2.png") no-repeat;
  background-size: cover;
  padding-left: 77px;
  @include dis-flex(center, center);
  position: relative;
  .auth {
    position: absolute;
    bottom: 30px;
    color: #fff;
    font-size: 14px;
    a {
      color: #fff !important;
      text-decoration: none;
    }
  }
  .go {
    position: absolute;
    text-align: center;
    top: 90px;
    right: 20px;
    color: #fff;
    .address {
      margin-top: 5px;
      a {
        color: $primary-color;
        font-weight: bold;
      }
    }
  }
}
</style>
