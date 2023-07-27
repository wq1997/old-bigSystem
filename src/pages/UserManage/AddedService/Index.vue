<template>
  <div class="userList">
    <PlaneBox>
      <template #title>
        <div class="title-wrapper">
          <span>{{ $translate("增值业务") }}</span>
          <el-button type="primary" size="small" @click="handleRecharge">{{
            $translate("充值")
          }}</el-button>
        </div>
      </template>
      <template #content>
        <List :tableData="tableData" />
      </template>
    </PlaneBox>
    <Pagination
      :total="total"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @e_changePage="e_changePage"
    />
    <Recharge :visible.sync="visible" />
  </div>
</template>

<script>
import { SubSocket } from "@/lib/socket/socketTools";
import { socketSubUrlTopic } from "@/common/config";
import { getToken, showMessage } from "@/common/utils";
import { apiRecharge, apiGetPayResult, apiGetOrderList } from "@/api/user";
import { createNamespacedHelpers } from "vuex";
const { mapGetters: user_getters } = createNamespacedHelpers("user");
export default {
  name: "UserList",
  data() {
    return {
      userType: 0,
      visible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 30,
      total: 0,
      adminUserList: []
    };
  },
  mounted() {
    let { subUrl, topic } = socketSubUrlTopic.payResult;
    SubSocket(subUrl, topic, getToken(), "", res => {
      console.log(res);
      if (res.code) {
        this.visible = false;
        showMessage("success", "支付成功");
      }
    });
    this.userType = this.userInfo.type;
    this.getOrderList();
  },
  components: {
    List: _ => import("./List"),
    Recharge: _ => import("./Recharge"),
    Pagination: _ => import("@/components/Pagination"),
    PlaneBox: _ => import("@/components/PlaneBox")
  },
  methods: {
    e_changePage(page) {
      this.currentPage = page;
    },
    async getOrderList() {
      let { list, total } = await apiGetOrderList({
        pageNum: this.currentPage,
        pageSize: this.pageSize
      });
      this.tableData = list;
      this.total = total;
    },
    handleRecharge() {
      this.visible = true;
    }
  },
  computed: {
    ...user_getters(["userInfo"])
  },
  watch: {
    visible(newValue) {
      if (!newValue) {
        this.getOrderList();
      }
    }
  }
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
