<template>
    <div class="plantList">
        <PasswordModal />
        <PlaneBox>
            <template #title>
                <div class="title-wrapper">
                    <span> {{ $translate("电站列表") }}</span>
                    <i class="el-icon-plus add-icon" @click="handleAdd"></i>
                </div>
            </template>
            <template #content>
                <List :tableData="calculateTableData" @e_upDateList="e_upDateList" @e_edit="e_edit" />
            </template>
        </PlaneBox>
        <Pagination :total="allPlants.length" :currentPage="currentPage" :pageSize="pageSize"
            @e_changePage="e_changePage" />
        <AddPlant :dialogObj.sync="dialogObj" :commonUserList="commonUserList" @e_upDateList="e_upDateList" />
    </div>
</template>

<script>
import { apiGetAllCommonUser } from "@/api/user";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: plant_getters, mapActions: plant_actions } =
    createNamespacedHelpers("plant");
export default {
    name: "PlantList",
    data() {
        return {
            userType: 0,
            dialogObj: {},
            tableData: [],
            currentPage: 1,
            pageSize: 30,
            total: 0,
            commonUserList: [],
        };
    },
    mounted() {
        this.getAllCommonUser();
        this.getAllPlants();
    },
    components: {
        List: (_) => import("./components/List"),
        AddPlant: (_) => import("./components/AddPlant"),
        Pagination: (_) => import("@/components/Pagination"),
        PlaneBox: (_) => import("@/components/PlaneBox"),
        PasswordModal: (_) => import("@/components/PasswordModal"),
    },
    methods: {
        ...plant_actions(["getAllPlants"]),
        e_changePage(page) {
            this.currentPage = page;
        },
        async getAllCommonUser() {
            let { data } = await apiGetAllCommonUser();
            this.commonUserList = data ? JSON.parse(data) : [];
        },
        e_upDateList() {
            this.currentPage = 1;
            this.getAllPlants();
        },
        handleAdd() {
            this.dialogObj = { flag: true };
        },
        e_edit(row) {
            this.dialogObj = { flag: true, ...row };
        },
    },
    computed: {
        ...plant_getters(["allPlants"]),
        calculateTableData() {
            return this.allPlants.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.plantList {
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
