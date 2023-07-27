<template>
    <div class="table-wrapper">
        <el-table :data="tableData" size="medium" :max-height="tableHeight">
            <el-table-column
                prop="name"
                min-width="150"
                :label="$translate('电站名称')"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="createUserName"
                :label="$translate('所属用户')"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="timeZone"
                :label="$translate('时区')"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="longitude"
                :label="$translate('经度')"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="latitude"
                :label="$translate('纬度')"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="installDate"
                :label="$translate('安装日期')"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    {{ c_installDate(scope.row.installDate) }}
                </template>
            </el-table-column>
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
                    <el-link type="danger" @click="handleDelete(scope.row)">{{
                        $translate("删除")
                    }}</el-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { plantStatus, plantTypes } from "@/common/config";
import { apiDeletePlant } from "@/api/plant";
import { showMessage, getLabelById, momentFormate } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";

export default {
    name: "List",
    data() {
        return {
            tableHeight: document.documentElement.clientHeight - 200,
            plantStatus,
            plantTypes,
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
            this.$emit("e_edit", row);
        },
        handleDelete({ plantId }) {
            this.$confirm(
                this.$translate("确定删除？"),
                this.$translate("系统提示"),
                {
                    confirmButtonText: this.$translate("确定"),
                    cancelButtonText: this.$translate("取消"),
                    type: "warning",
                }
                
            ).then(async (_) => {
                let { code } = await apiDeletePlant({ plantId });
                if (code === "ok") {
                    showMessage("success", this.$translate("删除成功"));
                    this.$emit("e_upDateList");
                }
            });
        },
       
    },
    computed: {
        c_installDate() {
            return (installDate) =>
                momentFormate(installDate, "YYYY-MM-DD HH:mm:ss");
        },
        c_getLabel() {
            return (id, arr) => this.$translate(getLabelById(id, arr));
        },
    },
    mounted(){
        
    }
};
</script>

<style lang="scss">
.table-wrapper {
    padding: 20px;
    box-sizing: border-box;
}
</style>
