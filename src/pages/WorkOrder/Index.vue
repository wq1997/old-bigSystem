<template>
    <div class="workOrder">
        <div class="header">
            <el-button size="mini" type="success" @click="screenFlag = true">
                {{ $translate("筛选") }}
            </el-button>
            <el-button
                size="mini"
                type="primary"
                @click="handleAddOrder"
                v-if="roleId !== 8"
                >+ {{ $translate("创建工单") }}
            </el-button>
        </div>
        <el-tabs v-model="orderListType" @tab-click="handleClickTap">
            <el-tab-pane
                :label="$translate('我的工单')"
                name="1"
                v-if="roleId !== 8"
            ></el-tab-pane>
            <el-tab-pane
                :label="$translate('待我处理')"
                name="2"
                v-if="userType >= 3"
            ></el-tab-pane>
        </el-tabs>
        <div class="main">
            <el-table
                :data="tableData"
                v-loading="loading"
                :max-height="tableHeight"
            >
                <el-table-column
                    prop="processId"
                    :label="$translate('工单编号')"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    v-if="orderListType === '2'"
                    prop="createUserName"
                    :label="$translate('用户')"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="title"
                    :label="$translate('标题')"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="status"
                    :label="$translate('状态')"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="remark"
                    :label="$translate('备注')"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    sortable
                    :label="$translate('提交时间')"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span>{{ c_formateDate(scope.row.createTime) }} </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="noReadCount"
                    :label="$translate('未读消息')"
                    width="100"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <el-tag type="danger" effect="dark" size="mini">
                            {{ scope.row.noReadCount }}
                        </el-tag>
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
                            @click="handleDetail(scope.row)"
                        >
                            {{ $translate("详情") }}
                        </el-link>
                        <el-link
                            type="danger"
                            v-if="userType >= 3 && roleId !== 8"
                            @click="handleDelete(scope.row)"
                        >
                            {{ $translate("删除") }}
                        </el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :currentPage="currentPage"
            :pageSize="pageSize"
            @current-change="currentChange"
        >
        </el-pagination>
        <Screen :screenFlag="screenFlag" @mergeOptions="mergeOptions" />
        <CreateWorkOrder
            :addWorkOrderFlag="addWorkOrderFlag"
            @e_close="e_close"
        />
        <WorkOrderDetail
            :orderDetailIdListType="orderDetailIdListType"
            @e_close="e_close"
        />
    </div>
</template>

<script>
import { SubSocket } from "@/lib/socket/socketTools";
import { socketSubUrlTopic } from "@/common/config";
import { apiGetMyOrderList, apiGetDealOrderList } from "@/api/user";
import { apiDeleteOrder } from "@/api/user";
import { momentFormate, showMessage, setToken } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapMutations: app_mutations } = createNamespacedHelpers("app");
export default {
    name: "WorkOrder",
    data() {
        return {
            tableHeight: document.documentElement.clientHeight - 200,
            screenFlag: false,
            addWorkOrderFlag: false,
            loading: false,
            orderDetailIdListType: {},
            orderListType: "1",
            currentPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
            options: {},
            roleId: 0,
            userType: 0,
        };
    },
    created() {
        let { token, locale, type, roleId } = this.$route.query;
        setToken(token);
        this.changeLocale(locale);
        this.roleId = parseInt(roleId);
        this.userType = parseInt(type);
        if (this.roleId === 8) {
            this.orderListType = "2";
        }
        this.subscribe(token);
    },
    components: {
        Screen: (_) => import("./components/Screen"),
        CreateWorkOrder: (_) => import("./components/CreateWorkOrder"),
        WorkOrderDetail: (_) => import("./components/WorkOrderDetail"),
    },
    methods: {
        ...app_mutations(["set_locale"]),
        changeLocale(value) {
            this.set_locale(value);
            this.$i18n.locale = value;
        },
        mergeOptions(options) {
            this.screenFlag = false;
            if (options) {
                this.currentPage = 1;
                this.options = options;
                this.getOrderList();
            }
        },
        handleAddOrder() {
            this.addWorkOrderFlag = true;
        },
        e_close(flag) {
            this.addWorkOrderFlag = false;
            this.orderDetailIdListType = {};
            flag === true && this.getOrderList();
        },
        handleClickTap() {
            this.getOrderList();
        },
        async getOrderList() {
            this.loading = true;
            let requestData = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                ...this.options,
            };
            let fn =
                this.orderListType === "1"
                    ? apiGetMyOrderList
                    : apiGetDealOrderList;
            let { data } = await fn(requestData);
            this.loading = false;
            if (data) {
                let { list, total } = data;
                this.total = total;
                this.tableData = list;
            }
        },
        handleDetail({ id: workOrderId }) {
            this.orderDetailIdListType = Object.assign(
                { orderListType: this.orderListType },
                { workOrderId }
            );
        },
        handleDelete({ id }) {
            this.$confirm(
                this.$translate("确认删除此工单？"),
                this.$translate("系统提示"),
                {
                    confirmButtonText: this.$translate("确定"),
                    cancelButtonText: this.$translate("取消"),
                    type: "warning",
                }
            ).then(async (_) => {
                this.loading = true;
                let { code } = await apiDeleteOrder({
                    workOrderId: id,
                });
                this.loading = false;
                if (code === "ok") {
                    showMessage("success", this.$translate("删除成功"));
                    this.getOrderList();
                }
            });
        },
        currentChange(current) {
            this.currentPage = current;
            this.getOrderList();
        },
        subscribe(token) {
            let { subUrl, topic } = socketSubUrlTopic.workOrder;
            SubSocket(subUrl, topic, token, "", ({ code }) => {
                code === "ok" && this.getOrderList();
            });
        },
    },
    computed: {
        c_formateDate() {
            return (time) => momentFormate(time, "YYYY-MM-DD HH:mm:ss");
        },
    },
};
</script>

<style lang="scss" scoped>
.workOrder {
    width: 100%;
    min-height: 100vh;
    @include bg-color("1");

    .header {
        height: 60px;
        line-height: 60px;
        text-align: right;
        padding: 0 40px;
        box-sizing: border-box;
    }

    .el-tabs {
        width: 90%;
        margin: 0 auto;
    }

    .main {
        width: 90%;
        margin: 0 auto;
    }

    .el-pagination {
        width: 90%;
        margin: 0 auto;
        height: 60px;
        @include dis-flex(flex-end, center);
    }
}
</style>
