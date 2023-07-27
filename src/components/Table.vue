<template>
    <el-table
        :data="tableData"
        :max-height="tableHeight"
        v-loading="loading"
        element-loading-text="...loading"
        element-loading-spinner="el-icon-loading"
    >
        <el-table-column
            v-for="item in columns"
            :key="item.key"
            :prop="item.key"
            :label="$translate(item.label)"
            :formatter="item.formatter"
            align="center"
            show-overflow-tooltip
            item.config
        >
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: "Table",
    data() {
        return {
            tableHeight: document.documentElement.clientHeight - 200,
        };
    },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        columns: {
            type: Array,
            default: (_) => [],
        },
        tableData: {
            type: Array,
            default: (_) => [],
        },
    },
};
</script>

 