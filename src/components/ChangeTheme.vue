<template>
  <el-dialog
    :title="$translate('切换主题')"
    :visible.sync="visible"
    width="500px"
    :before-close="handleCancle"
    :append-to-body="true"
  >
    <el-radio v-model="theme" label="light" @change="changeTheme">{{
      $translate("灰白色")
    }}</el-radio>
    <el-radio v-model="theme" label="black" @change="changeTheme">{{
      $translate("灰黑色")
    }}</el-radio>
    <el-radio v-model="theme" label="green" @change="changeTheme">{{
      $translate("黑绿色")
    }}</el-radio>
  </el-dialog>
</template>

<script>
import { apiGetPublicKey, apiModifyPwd } from "@/api/user";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: app_getters, mapMutations: app_mutations } =
  createNamespacedHelpers("app");
export default {
  name: "ChangeTheme",
  data() {
    return {
      theme: "",
      visible: false,
    };
  },
  computed: {
    ...app_getters(["systemTheme", "themeVisible"]),
  },
  methods: {
    ...app_mutations(["set_systemTheme", "set_themeVisible"]),
    changeTheme(theme) {
      this.set_systemTheme(theme);
    },
    handleCancle() {
      this.set_themeVisible(false);
    },
  },
  watch: {
    systemTheme: {
      immediate: true,
      handler(newVal) {
        this.theme = newVal;
      },
    },
    themeVisible: {
      immediate: true,
      handler(newVal) {
        this.visible = newVal;
      },
    },
  },
};
</script>

<style scoped lang="scss">
.el-dialog__body {
  text-align: center;
}
</style>
