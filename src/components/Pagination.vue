<template>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handleChangePage"
    >
    </el-pagination>
</template>

<script>
export default {
    name: "Pagination",
    props: {
        total: {
            type: Number,
            default: 0,
        },
        currentPage: {
            type: Number,
            default: 1,
        },
        pageSize: {
            type: Number,
            default: 20,
        },
    },
    methods: {
        handleChangePage(page) {
            this.$emit("e_changePage", page);
        },
    },
};
</script>

<style lang="scss" scoped>
.el-pagination {
    margin-top: 20px;
    text-align: right;
}
</style>
