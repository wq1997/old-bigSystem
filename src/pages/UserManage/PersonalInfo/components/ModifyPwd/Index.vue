<template>
    <el-form :model="formData" size="medium" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$translate('旧密码')" prop="oldPassword">
            <el-input type="password" v-model="formData.oldPassword" autocomplete="off" show-password></el-input>
        </el-form-item>

        <el-form-item :label="$translate('新密码')" prop="newPassword">
            <el-input type="password" v-model="formData.newPassword" autocomplete="off" show-password></el-input>
        </el-form-item>

        <el-form-item :label="$translate('确认密码')" prop="confirmPassword">
            <el-input type="password" v-model="formData.confirmPassword" autocomplete="off" show-password></el-input>
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
import { apiGetPublicKey, apiModifyPwd } from "@/api/user";
import { showMessage, setEncrypt, removeToken } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: user_getters, mapMutations: user_mapMutations } =
    createNamespacedHelpers("user");

export default {
    name: "ModifyPwd",
    data() {
        let validateConfirmPassword = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(this.$translate("请再次输入密码")));
            } else if (value !== this.formData.newPassword) {
                callback(new Error(this.$translate("两次输入密码不一致")));
            } else {
                callback();
            }
        };
        return {
            formData: {
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            },
            rules: {
                oldPassword: [
                    {
                        required: true,
                        message: this.$translate("请输入旧密码"),
                        trigger: "blur",
                    },
                ],
                newPassword: [
                    {
                        required: true,
                        message: this.$translate("请输入新密码"),
                        trigger: "blur",
                    },
                    {
                        message: this.$translate("密码格式有误"),
                        trigger: "blur",
                        pattern: /^(a-z|A-Z|0-9|)[a-zA-Z0-9~!@&%#_]{1,16}$/,
                    },
                ],
                confirmPassword: [
                    {
                        validator: validateConfirmPassword,
                        required: true,
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        ...user_mapMutations(["setUserInfo"]),
        handleCancle() {
            Object.keys(this.formData).forEach((key) => {
                this.formData[key] = "";
            });
        },
        async handleSure() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (!valid) return;
                let { data: key } = await apiGetPublicKey();
                if (!key) return;
                let { oldPassword, newPassword } = this.formData;
                let requestData = {
                    oldPswd: setEncrypt(key, oldPassword),
                    newPswd: setEncrypt(key, newPassword),
                };
                let { data } = await apiModifyPwd(requestData);
                if (data) {
                    showMessage("success", this.$translate("修改成功"));
                    removeToken();
                    this.$router.push('/authorization')
                }
            });
        },
    },
    computed: {
        ...user_getters(["userInfo"]),
    },
};
</script>

<style lang="scss" scoped>
</style>
