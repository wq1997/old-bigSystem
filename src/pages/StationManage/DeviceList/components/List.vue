<template>
  <div class="table-wrapper">
    <el-table :data="tableData" size="medium" :max-height="tableHeight">
      <el-table-column
        prop="id"
        label="dtuId"
        width="100px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="sn" label="sn" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="online"
        :label="$translate('状态')"
        width="100px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="plantName"
        :label="$translate('所属电站')"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="hardwareVersion"
        label="DSP"
        width="100px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="softwareVersion"
        label="PCU"
        width="100px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column :label="$translate('操作')" align="center" width="180">
        <template slot-scope="scope">
          <el-link
            style="margin-right: 5px"
            type="primary"
            size="mini"
            @click="handleEdit(scope.row)"
            >{{ $translate("编辑") }}</el-link
          >
          <el-link type="danger" @click="handleDelete(scope.row)">{{
            $translate("删除")
          }}</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { apiDeleteDevice } from "@/api/device";
import { showMessage } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";

const {
  mapGetters: device_getters,
  mapMutations: device_mutations,
  mapActions: device_actions,
} = createNamespacedHelpers("device");
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
    ...device_actions(["getDevicesCount"]),

    handleEdit(row) {
      this.$emit("e_edit", row);
    },
    handleDelete({ id: dtuId }) {
      this.$confirm(
        this.$translate("确定删除？"),
        this.$translate("系统提示"),
        {
          confirmButtonText: this.$translate("确定"),
          cancelButtonText: this.$translate("取消"),
          type: "warning",
        }
      ).then(async (_) => {
        let { code } = await apiDeleteDevice({ dtuId });
        if (code === "ok") {
          showMessage("success", this.$translate("删除成功"));
          this.getDevicesCount();
          this.$emit("e_upDateList");
          if (!this.tableData) {
            this.$router.replace("/containerIndex");
          }
        }
      });
    },
  },
  mounted () {
  }
};
</script>
<style lang="scss">
.table-wrapper {
  padding: 20px;
  box-sizing: border-box;
}
</style>
