<template>
  <div class="alarm-config">
    <div class="table-wrapper">
      <div class="card-title ">
        <span>{{ $translate("报警配置") }}</span>
      </div>
      <el-table
        :data="calculateTableData"
        size="medium"
        :max-height="tableHeight"
      >
        <el-table-column
          prop="id"
          :label="$translate('序号')"
          width="100"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="desc" :label="$translate('名称')" align="center">
        </el-table-column>

        <el-table-column :label="$translate('操作')" align="center" width="180">
          <template slot-scope="scope">
            <el-switch
              v-on:change="changeSwitch($event, scope.row.id)"
              v-model="scope.row.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="√"
              inactive-text="×"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="tableData.length"
      :page-size="pageSize"
      @current-change="handleChangePage"
    >
    </el-pagination>
  </div>
</template>

<script>
import { apiGetAlarmConfig, apiUpdateAlarmConfig } from "@/api/alarm";
import { showMessage } from "@/common/utils";
export default {
  name: "AlarmConfig",
  data() {
    return {
      total: 100,
      pageSize: 30,
      currentPage: 1,
      tableData: [],
      tableHeight: document.documentElement.clientHeight - 100
    };
  },
  mounted() {
    this.getAlarmConfig();
  },
  computed: {
    calculateTableData() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    }
  },
  methods: {
    async getAlarmConfig() {
      let { data } = await apiGetAlarmConfig();
      if (data) {
        this.tableData = data;
      }
    },
    async changeSwitch(enable, id) {
      let requestData = [{ enable, id }];
      let { code } = await apiUpdateAlarmConfig(requestData);
      code === "ok" && showMessage("success", this.$translate("修改成功"));
    },
    handleChangePage(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style lang="scss" scoped>
.alarm-config {
  .table-wrapper {
    @include bg-color("2");
    border-radius: 5px;
  }
  .card-content {
    padding: 20px;
    box-sizing: border-box;
  }
  .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
