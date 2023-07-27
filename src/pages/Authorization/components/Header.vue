<template>
    <div class="header">
        <div class="contact">
            <div>
                <i class="iconfont icon-dianhua1"></i>
                <span>+86 021-69986891</span>
            </div>
            <div>
                <i class="iconfont icon-youxiang"></i>
                <span>support@sermatec-ess.com</span>
            </div>
        </div>
        <h2>{{ $translate("采日云平台监控系统") }}</h2>
        <el-select v-model="defalutLocale" size="mini" @change="changeLocale">
            <el-option
                v-for="item in localeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
                <svg class="color-icon" aria-hidden="true">
                    <use :xlink:href="item.icon"></use>
                </svg>
                {{ item.label }}
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { localeOptions } from "@/common/config";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: app_getters, mapMutations: app_mutations } =
    createNamespacedHelpers("app");

export default {
    name: "Header",
    data() {
        return {
            localeOptions,
            defalutLocale: "",
        };
    },
    mounted() {
        console.log(navigator.language);
        this.defalutLocale = this.locale;
    },
    computed: {
        ...app_getters(["locale"]),
    },
    methods: {
        ...app_mutations(["set_locale"]),
        changeLocale(value) {
            this.defalutLocale = value;
            this.set_locale(value);
            this.$i18n.locale = value;
        },
    },
};
</script>

<style scoped lang="scss">
.color-icon {
    width: 20px;
    height: 20px;
    vertical-align: middle;
}
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    color: $primary-color;
    background: #fff;
    padding: 0 30px;
    box-sizing: border-box;
    @include dis-flex(space-between, center);
    .contact {
        color: #0d2133;
        font-size: 13px;
        :nth-child(1) {
            margin: 5px 0;
        }
        i {
            margin-right: 7px !important;
        }
    }
    .el-select {
        width: 120px;
    }
}
</style>
