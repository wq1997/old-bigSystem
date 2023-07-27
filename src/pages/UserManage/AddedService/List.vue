<template>
  <div class="table-wrapper">
    <el-table :data="tableData" size="medium" :max-height="tableHeight">
      <el-table-column
        prop="equipment"
        :label="$translate('充值设备')"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="outTradeNo"
        :label="$translate('订单号')"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="expirationTime"
        :label="$translate('服务类型')"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">
          {{ { 1: "监控", 2: "告警", 3: "统计" }[scope.row.functionType] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="successTime"
        :label="$translate('支付时间')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ c_time(scope.row.successTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="payerTotal"
        :label="$translate('支付金额')"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="payType"
        :label="$translate('支付方式')"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="tradeStateDesc"
        :label="$translate('支付状态')"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="expirationTime"
        :label="$translate('到期时间')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ c_time(scope.row.expirationTime) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { momentFormate } from "@/common/utils";
export default {
  name: "List",
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 200
    };
  },
  components: {
    Table: _ => import("@/components/Table")
  },
  props: {
    tableData: {
      type: Array,
      default: _ => []
    }
  },
  computed: {
    c_time() {
      return time => momentFormate(time, "YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="scss">
.table-wrapper {
  padding: 20px;
  box-sizing: border-box;
}
</style>
