<template>
  <div class="alarm-config">
    <PasswordModal />
    <div class="table-wrapper">
      <div class="card-title ">
        <span>{{ $translate("报警规则") }}</span>
        <el-button type="primary" size="mini" @click="showDrawer">{{
          $translate("添加")
        }}</el-button>
      </div>
      <el-table :data="tableData" size="medium" :max-height="tableHeight">
        <el-table-column
          prop="almTypeName"
          :label="$translate('告警描述')"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="initNum"
          :label="$translate('每小时推送上限')"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="maxNum"
          :label="$translate('每日推送上限')"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="pushTypeName"
          :label="$translate('推送方式')"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="status"
          :label="$translate('禁启用')"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.status ? "启用" : "禁用" }}
          </template>
        </el-table-column>

        <el-table-column
          prop="userNames"
          :label="$translate('接收人')"
          align="center"
        >
        </el-table-column>
        <el-table-column :label="$translate('操作')" align="center" width="180">
          <template slot-scope="scope">
            <el-link
              style="margin-right: 5px"
              type="primary"
              size="mini"
              @click="() => (updateRow = scope.row)"
              >{{ $translate("编辑") }}
            </el-link>
            <el-link type="danger" @click="handleDelete(scope.row.id)"
              >{{ $translate("删除") }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Drawer :updateRow="updateRow" @close="close" />
  </div>
</template>

<script>
import {
  apiGetAlarmConfig,
  apiUpdateAlarmConfig,
  apiGetAlarmRules,
  apiDeleteAlarmRule
} from "@/api/alarm";
import { showMessage } from "@/common/utils";
import Drawer from "./Drawer.vue";
export default {
  name: "AlarmConfig",
  data() {
    return {
      flag: false,
      updateRow: {},
      tableData: [],
      tableHeight: document.documentElement.clientHeight - 100
    };
  },
  mounted() {
    this.getAlarmConfig();
  },
  components: {
  },
  methods: {
    showDrawer() {
      this.updateRow = { id: 0 };
    },
    close() {
      this.updateRow = {};
      this.getAlarmConfig();
    },
    async getAlarmConfig() {
      let { data } = await apiGetAlarmRules();
      this.tableData = JSON.parse(data || "[]");
    },
    async changeSwitch(enable, id) {
      let requestData = [{ enable, id }];
      let { code } = await apiUpdateAlarmConfig(requestData);
      code === "ok" && showMessage("success", this.$translate("修改成功"));
    },
    handleChangePage(page) {
      this.currentPage = page;
    },
    handleDelete(alarmRuleId) {
      this.$confirm(
        this.$translate("确定删除？"),
        this.$translate("系统提示"),
        {
          confirmButtonText: this.$translate("确定"),
          cancelButtonText: this.$translate("取消"),
          type: "warning"
        }
      ).then(async _ => {
        let { code } = await apiDeleteAlarmRule({ alarmRuleId });
        if (code === "ok") {
          showMessage("success", this.$translate("删除成功"));
          this.getAlarmConfig();
        }
      });
    }
  },
  components: {
        PasswordModal: (_) => import("@/components/PasswordModal"),
        Drawer
    },
};
</script>

<style lang="scss" scoped>
.alarm-config {
  .table-wrapper {
    @include bg-color("2");
    border-radius: 5px;
  }
  .card-title {
    display: flex;
    justify-content: space-between;
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
