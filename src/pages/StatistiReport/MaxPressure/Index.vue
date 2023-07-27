<template>
  <div class="maxPressure">
    <div class="search-wrapper">
      <div class="search-wrapper">
        <span class="search-name">{{ $translate("电池组") }}：</span>
        <el-select v-model="currentGroup" 
        size="mini" placeholder="请选择">
          <el-option
            v-for="item in batteryGroup"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <span class="search-name">{{ $translate("日期") }}：</span>
        <DatePick
          :defaultDate="date"
          type="date"
          @change="changeDate"
        ></DatePick>
      </div>
      <el-button type="primary" size="mini" @click="getChartsData">{{
        $translate("查询")
      }}</el-button
      ><ExportExcel
        :header="getExcelParams.header"
        :title="getExcelParams.title"
        :fields="getExcelParams.fields"
        :data="excelData"
      />
    </div>
    <PlaneBox>
      <span slot="title">{{ $translate("电池最大压差") }}</span>
      <CategoryChart :args="volChartArgs" slot="content" />
    </PlaneBox>
  </div>
</template>

<script>
import { apiBatteryCount, apiGetMaxMinVolCure,apiGetContainerCellCount,apiGetMaxMinVolDiffByGroupId } from "@/api/device";
import { nowTime } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
  name: "MaxPressure",
  data() {
    return {
      date: nowTime(0, "YYYY-MM-DD"),
      volChartArgs: {
        ref: "maxPressure",
        options: {
          tooltip: {
            formatter: (params) =>
              this.getTooltip(params, this.$translate("最大电压")),
          },
          xAxis: {
            name: "",
            data: [],
            axisLabel: {
              formatter: function (params) {
                let { clusterId } = JSON.parse(params);
                return `Pack ${clusterId}`;
              },
            },
          },
          yAxis: {
            name: "V",
            max: 0,
            min: 0,
            splitNumber: 5,
            axisLabel: {
              formatter: function (value, index) {
                return value.toFixed(3);
              },
            },
          },
          series: [
            { name: this.$translate("最大电压"), data: [] },
            { name: this.$translate("最小电压"), data: [] },
          ],
        },
      },
      batteryGroup: [],
      currentGroup: 1,
      excelData: [],
    };
  },
  mounted() {
    this.getBatteryCount();
  },
  computed: {
    ...device_getters(["currentDevice","version"]),
    getExcelParams() {
      return {
        header: `${this.date}-${this.currentDevice.sn}-电池最大压差/V`,
        title: "电池最大压差",
        fields: {
          ["电池组"]: {
            field: "time",
            callback: () => this.currentGroup,
          },
          电压差: "nowDiff",
          发生时间: "nowTime",
          最大电压: "nowMax",
          最大电压发生位置: {
            field: "nowMaxCell",
            callback: (nowMaxCell) => `第${nowMaxCell}节`,
          },
          最小电压: "nowMin",
          最小电压发生位置: {
            field: "nowMinCell",
            callback: (nowMinCell) => `第${nowMinCell}节`,
          },
        },
      };
    },
  },
  components: {
    DatePick: (_) => import("@/components/DatePick"),
    PlaneBox: (_) => import("@/components/PlaneBox"),
    CategoryChart: (_) => import("@/components/Chart/CategoryChart"),
    ExportExcel: (_) => import("@/components/ExportExcel"),
  },
  methods: {
    changeDate(value) {
      this.date = value;
    },
    async getContainerCellCount() {
            this.currentGroup='1,1';
            let { data } = await apiGetContainerCellCount({
                containerId: sessionStorage.getItem("containerId"),
            });
            if (data) {
                for (let i = 1; i <= data.length; i++) {
                    for (let j = 1; j <= +data[i - 1]; j++) {
                        let heapNum = `${this.$translate("第")}${i}${this.$translate("堆")}${j}#${this.$translate("电池组")}`;
                        this.batteryGroup.push({
                            label: heapNum,
                            value: i + ',' + j,
                        });
                    }
                }
            }
        },
    async getBatteryCount() {
      if (this.version == "2") {
                this.getContainerCellCount();
                this.getChartsData();
                return;
            }
      let { data: count } = await apiBatteryCount({
        dtuId: this.currentDevice.id,
      });
      if (count) {
        for (let i = 1; i <= count; i++) {
          let group = i + `#${this.$translate("电池组")}`;
          this.batteryGroup.push({
            label: group,
            value: i,
          });
        }
      }
      this.getChartsData();
    },
    getTooltip(params, name) {
      let { clusterId, nowDiff, nowMaxCell, nowMinCell, nowTime } = JSON.parse(
        params[0].axisValue
      );
      let text = `
                <div>
                   <div>Pack ${clusterId}</div>
                   <div>${this.$translate(
                     "电压差"
                   )}：${nowDiff} ${this.$translate("时间")}：${nowTime}</div>
                </div>
              `;
      params.forEach(({ seriesName, data, color }) => {
        let bsu = seriesName === name ? nowMaxCell : nowMinCell;
        text += `
                    <div>  
                        <span style="
                           background:${color};
                           width:10px;
                           height:10px;
                           border-radius:50%;
                           display:inline-block
                          "
                         ></span>
                        ${seriesName}：${data} ${this.$translate(
          "第"
        )}${bsu}${this.$translate("节")}
                    </div> 
                    `;
      });
      return text;
    },
    async getChartsData() {
      let requestData={};
            if (this.version=='2') {
                 requestData = {      
                 containerId: sessionStorage.getItem('containerId'),
                 bmsIdx: this.currentGroup.split(',')[0]-1,
                 bmcIdx: this.currentGroup.split(',')[1]-1,
                date: this.date,
            };
            }else{
              requestData = {
                dtuId: this.currentDevice.id,
                date: this.date,
                groupId:this.currentGroup,
                
      };
    }
      let { data } = await (this.version=="2"?apiGetMaxMinVolDiffByGroupId(requestData):apiGetMaxMinVolCure(requestData));
      let parseData = JSON.parse(data || "[]");
      let [volxData, maxVol, minVol] = [[], [], []];
      let maxValue = 0;
      let minValue = 0;
      parseData.forEach((item, index) => {
        if (item.nowMax != 0 && index == 0) maxValue = item.nowMax;
        if (item.nowMin != 0 && index == 0) minValue = item.nowMin;
        if (item.nowMax > maxValue && item.nowMax != 0) maxValue = item.nowMax;
        if (item.nowMin < minValue && item.nowMin != 0) minValue = item.nowMin;
        volxData.push(JSON.stringify(item));
        maxVol.push(item.nowMax);
        minVol.push(item.nowMin);
      });
      this.volChartArgs.options.xAxis.data = volxData;
      this.volChartArgs.options.yAxis.max = maxValue + 0.02;
      this.volChartArgs.options.yAxis.min = minValue - 0.1;
      this.volChartArgs.options.series[0].data = maxVol;
      this.volChartArgs.options.series[1].data = minVol;
      this.excelData = parseData;
    },
  },
};
</script>
