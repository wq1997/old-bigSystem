<!-- 数据模块选择 -->
<template>
    <div class="selectData">
        <el-button type="primary" size='mini' @click="drawer = true">数据选择</el-button>
        <el-drawer :visible.sync="drawer" direction="ttb" size="70%" :show-close="false">
            <div slot="title" class="title-name">
                <span>数据选择</span>
                <div>
                    <el-button size="mini" @click="cancel">取 消</el-button>
                    <el-button type="primary" size="mini" @click="updateChecked">确 定</el-button>
                </div>
            </div>
            <template v-for="item in dataChange ">
                <DataCard :oneCardInfo="item" @getData="getChecked" />
            </template>
        </el-drawer>
    </div>
</template>

<script>
import { apiupdateReportTemplate, getReportList } from "@/api/device";
import { createNamespacedHelpers } from "vuex";
const {
    mapGetters: plant_getters,
} = createNamespacedHelpers("plant");
export default {
    name: "SelectDataModel",
    props: ["dataChange","type"],
    data() {
        return {
            drawer: false,
            checkData: [],
            runData: [],
            deviceData: [],
        }
    },
    created() {

    },
    mounted() {
    },
    computed: {
        ...plant_getters(["currentPlant",]),

    },
    components: {
        DataCard: () => import('./DataCard.vue'),
    },
    methods: {
        getChecked(check, type) {
            if (type === 'Run parameters'||type==='运行参数') {
                this.runData = check;
            } else {
                this.deviceData = check;
            }
            this.checkData = [...this.runData, ...this.deviceData];
            this.checkData = [...new Set(this.checkData)];
        },
        async updateChecked() {
            let { data } = await apiupdateReportTemplate({
                plantId: this.currentPlant.plantId,
                fields: this.checkData,
                type:this.type
            });
        
            this.$emit('updateList',this.type);
            this.drawer = false;
        },
        cancel() {
            this.drawer = false;
        },
        getNativeChecked(newData) {
            newData.forEach((item) => {
                item.children.forEach(ii => {
                    if (item.lable === 'Run parameters'||item.lable === '运行参数') {
                        ii.state === true ? this.runData.push(ii.value) : null;
                    } else {
                        ii.state === true ? this.deviceData.push(ii.value) : null;
                    }
                })
            })
            this.checkData = [...this.runData, ...this.deviceData];
            this.checkData = [...new Set(this.checkData)];
        }
    },
    watch: {
        dataChange: {
            deep: true,
            handler(newObj, oldObj) {
                this.getNativeChecked(this.dataChange);

            }
        }
    }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.selectData {
    .title-name {
        @include font-color("1");
        width: 100%;
        font-size: 20px;
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }

    /deep/.el-drawer__header {
        @include font-color("1");
    }

}
</style>