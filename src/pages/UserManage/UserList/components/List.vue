<template>
    <div class="table-wrapper">
        <el-table :data="tableData" size="medium" :max-height="tableHeight">
            <el-table-column
                prop="name"
                :label="$translate('用户名')"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="roleName"
                :label="$translate('角色')"
                show-overflow-tooltip
                width="150"
            >
            </el-table-column>
            <el-table-column
                prop="phone"
                :label="$translate('手机号')"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="mail"
                :label="$translate('邮箱')"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                prop="active"
                :label="$translate('账号状态')"
                show-overflow-tooltip
                width="150"
            >
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.active ? 'success' : 'info'"
                        size="mini"
                        effect="dark"
                    >
                        {{ c_accountSatus(scope.row.active) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="desc"
                :label="$translate('备注')"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                :label="$translate('操作')"
                align="center"
                width="180"
            >
                <template slot-scope="scope">
                    <el-link
                        style="margin-right: 5px"
                        type="primary"
                        size="mini"
                        @click="handleEdit(scope.row)"
                        >{{ $translate("编辑") }}
                    </el-link>
                    <el-link type="danger" @click="handleDelete(scope.row)"
                        >{{ $translate("删除") }}
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { apiDeleteUser } from "@/api/user";
import { showMessage, getAccountSatus } from "@/common/utils";

export default {
    name: "List",
    data() {
        return {
            tableHeight: document.documentElement.clientHeight - 200,
        };
    },
    components: {
        Table: (_) => import("@/components/Table"),
    },
    props: {
        tableData: {
            type: Array,
            default: (_) => [],
        },
    },
    methods: {
        handleEdit(row) {
            this.$emit("e_editUser", row);
        },
        handleDelete({ f0102_Id: userId }) {
            this.$confirm(
                this.$translate("确定删除？"),
                this.$translate("系统提示"),
                {
                    confirmButtonText: this.$translate("确定"),
                    cancelButtonText: this.$translate("取消"),
                    type: "warning",
                }
            ).then(async (_) => {
                let { data } = await apiDeleteUser({ userId });
                if (data) {
                    showMessage("success", this.$translate("删除成功"));
                    this.$emit("e_upDateAllUser");
                }
            });
        },
    },
    computed: {
        c_accountSatus() {
            return (statusId) => this.$translate(getAccountSatus(statusId));
        },
    },
};
</script>

<style lang="scss">
.table-wrapper {
    padding: 20px;
    box-sizing: border-box;
}
</style>
