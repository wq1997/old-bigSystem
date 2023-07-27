<template>
    <div class="register animate__animated animate__flipInY">
        <div class="logo"></div>
        <el-divider content-position="center">{{
            $translate("普通版")
        }}</el-divider>
        <el-input
            size="medium"
            v-model="name"
            prefix-icon="el-icon-user"
            :placeholder="$translate('用户名')"
            clearable
        ></el-input>
        <el-input
            size="medium"
            v-model="password"
            prefix-icon="el-icon-lock"
            :placeholder="$translate('密码')"
            show-password
            clearable
        ></el-input>
        <el-input
            size="medium"
            v-model="parentNo"
            prefix-icon="el-icon-postcard"
            :placeholder="$translate('父级客户编码')"
            clearable
        >
            <el-button slot="append" @click="getDefaultParentNo">{{
                $translate("获取默认")
            }}</el-button>
        </el-input>
        <el-input
            size="medium"
            v-model="desc"
            prefix-icon="el-icon-chat-line-square"
            :placeholder="$translate('备注')"
            clearable
        ></el-input>
        <div class="text-gologin">
            <span @click="changeForm('login')">{{
                $translate("已有账号？去登录")
            }}</span>
        </div>
        <el-button type="primary" size="medium" @click="handleRegister">
            {{ $translate("注册") }}
        </el-button>
    </div>
</template>

<script>
import {
    showMessage,
    setEncrypt,
    showLoading,
    closeLoading,
} from "@/common/utils";
import {
    apiGetPublicKey,
    apiGetDefaultParentNo,
    apiRegister,
} from "@/api/user";

export default {
    name: "Register",
    data() {
        return {
            name: "",
            password: "",
            parentNo: "",
            desc: "",
        };
    },
    methods: {
        changeForm(type) {
            this.$emit("changeForm", type);
        },
        async getDefaultParentNo() {
            let res = await apiGetDefaultParentNo();
            if (res.msg) {
                showMessage("error", res.msg);
            } else {
                this.parentNo = JSON.parse(res.data).no;
            }
        },
        async handleRegister() {
            let { data: key } = await apiGetPublicKey();
            if (!key) return;
            const requestData = {
                name: this.name,
                password: setEncrypt(key, this.password),
                parentNo: this.parentNo,
                desc: this.desc,
            };
            if (Object.values(requestData).includes("")) {
                return showMessage(
                    "warning",
                    this.$translate("请填写完整字段")
                );
            }
            let loginLoding = showLoading();
            let { data } = await apiRegister(requestData);
            closeLoading(loginLoding);
            if (data) {
                showMessage("success", this.$translate("注册成功"));
                this.$emit("changeForm", "login");
            }
        },
    },
};
</script>

<style scoped lang="scss">
.register {
    width: 390px;
    padding: 30px;
    height: 440px;
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

    .text-gologin {
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
