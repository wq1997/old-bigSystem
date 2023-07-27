<!-- 报表导出 -->
<template>
    <div class="report">
        <PlaneBox v-show="drawer">
            <span slot="title">{{ $translate("统计报表") }}</span>
            <div class="menuAll" slot="content">
                <template v-for="item in list ">
                    <ReportMenu class="oneMenu" :list="item" @click.native="handel(item)" />
                </template>
            </div>
        </PlaneBox>
        <div class="reportDetails" v-show="!drawer">
            <div class="top">
                <div class="back-nav" @click="drawer = !drawer">
                    <i class="iconfont icon-fanhui"></i>
                    <span class="tip">{{ $translate("返回") }}</span>
                </div>
                <span class="report-name">{{ $translate(currentData.title) }}</span>
            </div>
            <div class="search">
                <el-date-picker v-if="currentData.time != false" v-model="date" align="right" :type="currentData.time"
                    placeholder="选择日期" :picker-options="pickerOptions" size="mini" @change="dateChange">
                </el-date-picker>

                <DataSelect class="margin-l" :dataChange="dataModel" @updateList="getTableData" :type="currentType" />

                <el-button class="margin-l" size="mini" type="warning" @click="exportExcel">
                    ↓ Excel
                </el-button>
            </div>
            <div class="content" id="pdfDom" v-loading.lock="loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="report-title">
                    {{ formatDate }} {{ $translate("统计报表") }}
                </div>
                <div class="oneModel" v-if="Object.keys(basic).length">
                    <div class="statistics-title">
                        {{ basicInfo.title }}
                    </div>
                    <BasicInfo :basicInfo="basic" />
                </div>
                <div class="oneModel" v-if="Object.keys(run).length">
                    <div class="statistics-title">
                        {{ runInfo.title }}
                    </div>
                    <BasicInfo :basicInfo="run" />
                </div>
                <div class="oneModel" v-if="pcsData !== undefined">
                    <div class="statistics-title">
                        PCS运行指标
                    </div>
                    <Table :columns="PCS" :tableData="pcsData" />
                </div>
                <div class="oneModel" v-if="bmsData !== undefined">
                    <div class="statistics-title">
                        BMS运行指标
                    </div>
                    <Table :columns="BMS" :tableData="bmsData" />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { momentFormate, getToken } from "@/common/utils";
import { exportExcelMethod } from "@/common/excelExport";
import { baseUrl } from "@/common/config";
import { apigetDtuReport, getReportList, apiupdateReportTemplate, apiExoprtReport } from "@/api/device";
import { basicInfo, runInfo, PCS, BMS } from "@/common/config";
import { createNamespacedHelpers } from "vuex";
const {
    mapGetters: plant_getters,
} = createNamespacedHelpers("plant");
export default {
    name: "Report",
    data() {
        return {
            drawer: true,
            dataDrawer: true,
            list: [
                {
                    title: '日报表',
                    icon: 'icon-baobiao',
                    time: 'date',
                    type: 1,
                },
                {
                    title: '周报表',
                    icon: 'icon-zhoubaoS',
                    time: 'date',
                    type: 2,

                },
                {
                    title: '月报表',
                    icon: 'icon-yuebao',
                    time: 'month',
                    type: 3,

                },
                {
                    title: '年报表',
                    icon: 'icon-shouyetubiao2-27',
                    time: 'year',
                    type: 4,

                },
                {
                    title: '总报表',
                    icon: 'icon-zongjie',
                    time: false,
                    type: 5,

                },
            ],
            currentData: {},
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            date: momentFormate(Date.now(), 'YYYY-MM-DD'),
            dateType: '',
            formatDate: '',
            basic: {},
            run: {},
            dataModel: [],
            basicInfo,
            PCS,
            BMS,
            runInfo,
            pcsData: [],
            bmsData: [],
            excelData: {
                header: `${momentFormate(Date.now(), 'YYYY-MM-DD') + this.$translate("统计报表")}`,
                name: "电站报表",
                fields: {},
                data: [],
            },
            currentType: 1,
            loading: false

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
        ReportMenu: (_) => import('./components/ReportMenu.vue'),
        BasicInfo: (_) => import('./components/BasicInfo.vue'),
        PlaneBox: _ => import("@/components/PlaneBox"),
        DataSelect: (_) => import('./components/SelectDataModel.vue'),
        Table: (_) => import("@/components/TableNew"),
    },
    methods: {
        handel(item) {
            this.loading = true;
            this.drawer = !this.drawer;
            this.currentData = item;
            this.getDate(item.time);
            this.getTableData(item.type).then(() => this.loading = false);
            this.currentType = item.type;
        },
        getDate(type) {
            this.dateType = type;
            const date = new Date();
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            if (type === 'date') {
                // this.date = Date.now();
                this.formatDate = momentFormate(this.date, 'YYYY-MM-DD');
                this.date = momentFormate(this.date, 'YYYY-MM-DD');
                return this.date;
            } else if (type === 'month') {
                this.date = momentFormate(this.date, 'YYYY-MM');
                this.formatDate = momentFormate(this.date, 'YYYY-MM')
                return month;
            } else if (type === 'year') {
                this.date = momentFormate(this.date, 'YYYY');
                this.formatDate = momentFormate(this.date, 'YYYY');
                return year;
            }

        },
        async getTableData(type) {
            this.dataModel = [];
            let { data } = await getReportList({
                plantId: this.currentPlant.plantId,
                type,
            });
            let { reportData, reportDtu, label } = data;

            this.dataModel.push(reportData, reportDtu);

            let { data: tableData } = await apigetDtuReport({
                plantId: this.currentPlant.plantId,
                date: this.date,
                type
            });
            let { dtu, run, energy, totalEnergy,BMS,PCS } = tableData;
            this.initTableData(basicInfo, dtu, this.basic);
            this.initTableData(runInfo, run, this.run);
            this.pcsData = PCS;
            this.bmsData = BMS;
          
        },
        dateChange() {
            this.getDate(this.dateType);
            this.getTableData(this.currentType);
        },
        initTableData(basicObj, getObj, target) {
            target = {};
            Object.getOwnPropertyNames(basicObj).forEach((item, index) => {
                if (item !== 'title' && basicObj[item].name !== undefined && getObj[item] !== undefined) {
                    let key = {};
                    key['name'] = basicObj[item].name;
                    key['value'] = getObj[item];
                    target[item] = key;
                    if (item === 'installDate') {
                        target[item].value = momentFormate(target[item].value, 'YYYY-MM-DD');
                    };
                    if (item === 'date') {
                        target[item].value = this.formatDate;
                    };
                }
            })
            target['name'] ? this.basic = target : this.run = target;
        },
        async exportExcel() {

            const myObj = {
                method: 'get',
                url: baseUrl+'/energy/report/exportReport',
                fileName: `${this.formatDate + this.$translate('统计报表')}`,
                token: getToken(),
                params: {
                    plantId: this.currentPlant.plantId,
                    date: this.date,
                    type: this.currentType
                }
            }
            exportExcelMethod(myObj)

        }

    },
    watch: {
        basic: {
            handler: function (newVal, oldVal) {
            },
            deep: true,
            immediate: true,
        },
        run: {
            handler: function (newVal, oldVal) {
            },
            deep: true,
            immediate: true,
        },
    }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.report {
    @include bg-color(2);
    width: 100%;
    height: 100%;
}

.menuAll {
    padding-bottom: 15px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}

.top {
    height: 57px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    // border-bottom: 1px solid #DCDFE6;

    .back-nav {
        cursor: pointer;
        @include font-color("1");
    }

    .back-nav:hover * {
        color: $colorful_1;
    }

    .back-nav:hover {
        color: $colorful_1;
    }

    .report-name {
        margin-left: 15px;
        font-size: 16px;
        @include font-color("1");

    }

}

.search {
    margin-top: 16px;
    flex-shrink: 0;
    display: flex;
}

.content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    padding: 0 15px 15px;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
    @include bg-color(2);

    .report-title {
        text-align: center;
        border-bottom: 1px solid #d9d9d9;
        padding: 12px 0;
        font-size: 16px;
        @include font-color("1");

    }
}

.statistics-title {
    height: 32px;
    display: flex;
    align-items: center;
    font-size: 16px;
    @include font-color("1");

}

.oneModel {
    margin-bottom: 20px;

}
</style>