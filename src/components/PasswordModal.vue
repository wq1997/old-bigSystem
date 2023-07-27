<template>
    <div class="controlStrategy">
        <!-- <div class="mask">
            <div class="modal">
                <div class="tips">请输入用户密码</div>
                <div class="content">
                    <el-input v-model="password"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="handleSure"
                        >确 定</el-button
                    >
                </span>
            </div>
        </div> --><el-drawer
            title="隐私协议"
            :visible.sync="privacyVisible"
            direction="ttb"
        >
            <span>我来啦!</span>
        </el-drawer>
        <el-dialog
            :title="$translate('请输入用户密码')"
            :visible.sync="dialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :append-to-body="false"
            :modal-append-to-body="false"
            width="422px"
        >
            <el-input
                type="password"
                clearable
                show-password
                v-model="password"
            ></el-input>
            <!-- <div class="check-privacy">
                <el-checkbox v-model="isCheckedPrivacy">{{
                    $translate("已同意")
                }}</el-checkbox>
                <span
                    class="privacy-agreement"
                    @click="() => (privacyVisible = true)"
                    >隐私协议</span
                >
            </div> -->
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="() => $router.back(-1)">{{
                    $translate("取消")
                }}</el-button>
                <el-button type="primary" size="small" @click="handleSure">{{
                    $translate("确定")
                }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { apiVolidPassword, apiGetPublicKey } from "@/api/user";
import { showMessage, setEncrypt } from "@/common/utils";

export default {
    name: "PasswordModal",
    data() {
        return {
            password: "",
            dialogVisible: true,
            isCheckedPrivacy: false,
            privacyVisible: false,
        };
    },
    methods: {
        async handleSure() {
            // if (!this.isCheckedPrivacy)
            //     return showMessage("info", this.$translate("请先勾选隐私协议"));
            if (this.password === "") {
                return showMessage("info", this.$translate("请输入密码"));
            }
            let { data: key } = await apiGetPublicKey();
            if (!key) return;
            let { data } = await apiVolidPassword({
                password: setEncrypt(key, this.password),
            });
            if (data) {
                this.dialogVisible = false;
            } else {
                return showMessage("warning", this.$translate("密码错误"));
            }
        },
        showPrivacy() {},
    },
};
</script>

<style lang="scss" scoped>
// .controlStrategy {
//     position: relative;
//     .mask {
//         position: absolute;
//         width: 100%;
//         height: 100%;
//         background: rgba(0, 0, 0, 0.5);
//         z-index: 999;
//         display: flex;
//         justify-content: center;
//         .modal {
//             width: 422px;
//             height: 211px;
//             border-radius: 4px;
//             border: 1px solid #ebeef5;
//             font-size: 18px;
//             background: #fff;
//             padding: 15px;
//             .tips {
//                 margin-bottom: 10px;
//             }
//         }
//     }
// }

>>> .el-dialog {
    height: 183px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    .el-dialog__header {
        padding: 15px 15px 10px;
    }
    .el-dialog__body {
        padding: 10px 15px;
        margin-bottom: 10px;
        .check-privacy {
            margin-top: 10px;
            .privacy-agreement {
                text-decoration: underline;
                cursor: pointer;
                &:hover {
                    color: #0d9bff;
                }
            }
        }
        .tips {
            margin-bottom: 20px;
        }
    }
}
</style>
