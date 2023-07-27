<template>
    <el-date-picker
        v-model="date"
        :type="type"
        :size="size"
        :editable="false"
        :clearable="clearable"
        value-format="yyyy-MM-dd"
        range-separator="-"
        :placeholder="$translate('选择日期')"
        :start-placeholder="$translate('开始日期')"
        :end-placeholder="$translate('结束日期')"
         :picker-options="pickerOptions"
        @change="change"
    >
    </el-date-picker>
</template>

<script>
import { nowTime, deepClone } from "@/common/utils";
export default {
    name: "DatePick",
    data() {
        return {
            date: this.defaultDate,
             pickerOptions: this.disabledDate,
        };
    },
    props: {
        defaultDate: {
            type: String | Array,
            default: "",
        },
        type: {
            type: String,
            default: "date", // daterange
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "mini",
        },
        disabledDate: {
            type: Object,
            default:()=>{}
        }
    },
    methods: {
        change(value) {
            this.$emit("change", value);
        },
    },
};
</script>

<style lang="scss" scoped></style>
