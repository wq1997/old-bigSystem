<template>
    <div class="userList">
        <PasswordModal />
        <PlaneBox>
            <template #title>
                <div class="title-wrapper">
                    <span>{{ $translate("设备列表") }}</span>
                    <i class="el-icon-plus add-icon" @click="handleAdd"></i>
                </div>
            </template>
            <template #content>
                <List
                    :tableData="calculateTableData"
                    @e_upDateList="e_upDateList"
                    @e_edit="e_edit"
                />
            </template>
        </PlaneBox>
        <Pagination
            :total="total"
            :currentPage="currentPage"
            :pageSize="pageSize"
            @e_changePage="e_changePage"
        />
        <AddDevice :dialogObj.sync="dialogObj" @e_upDateList="e_upDateList" />
    </div>
</template>

<script>
import { apiAllDevices } from "@/api/device";
import { apiGetAllPlants } from "@/api/plant";
export default {
    name: "DeviceList",
    data() {
        return {
            dialogObj: {},
            tableData: [],
            currentPage: 1,
            pageSize: 30,
            total: 0,
        };
    },
    mounted() {
        this.getTableList();
    },
    components: {
        List: (_) => import("./components/List"),
        AddDevice: (_) => import("./components/AddDevice"),
        Pagination: (_) => import("@/components/Pagination"),
        PlaneBox: (_) => import("@/components/PlaneBox"),
        PasswordModal: (_) => import("@/components/PasswordModal"),
    },
    methods: {
        e_changePage(page) {
            this.currentPage = page;
        },
        async getTableList() {
            let { data } = await apiAllDevices();
            this.tableData = data ? JSON.parse(data) : [];
            this.total = this.tableData.length;
        },
        e_upDateList() {
            this.currentPage = 1;
            this.getTableList();
        },
        handleAdd() {
            this.dialogObj = { flag: true };
        },
        e_edit(row) {
            this.dialogObj = { flag: true, ...row };
        },
    },
    computed: {
        calculateTableData() {
            return this.tableData.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.userList {
    .plane-box {
        height: auto;
        margin: 0;
        .title-wrapper {
            width: 100%;
            @include dis-flex(space-between, center);
        }
    }
    .add-icon {
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
            color: $primary-color;
            transform: rotate(90deg);
            font-size: 28px;
        }
    }
}
</style>
