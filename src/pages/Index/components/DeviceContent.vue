<template>
  <transition mode="out-in">
    <div class="device-content" v-show="allDevices.length && version !== 2">
      <el-tooltip
        v-for="item in allDevices"
        :key="item.id"
        class="item"
        effect="dark"
        :content="item.sn"
        placement="right"
      >
        <div class="device-item" @click="handleShowDetail(item)">
          <img :src="item.deviceTypeId === 2 ? inverterImg : containerImg" />
          <div :class="item.online === '在线' ? 'onLine' : ''">
            {{ item.online }} -
            <span class="id">{{ item.id }}</span>
          </div>
        </div>
      </el-tooltip>
    </div>
  </transition>
</template>

<script>
import containerImg from "@/assets/images/box.png";
import inverterImg from "@/assets/images/5-10kdtu.png";
import { showMessage, redirectPath } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
import  routes_container  from "@/router/routes.container";
import { deepClone } from "../../../common/utils";


const {
  mapGetters: device_getters,
  mapMutations: device_mutations,
  mapActions: device_actions,
} = createNamespacedHelpers("device");
export default {
  name: "DeviceContent",
  data() {
    return {
      containerImg,
      inverterImg,
    };
  },
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...device_mutations(["setCurrentDevice"]),
    ...device_actions(["getDevicePermissions"]),
    async handleShowDetail(item) {
      this.setCurrentDevice(item);
      if (item.deviceTypeId == 1 || item.deviceTypeId === 3) {
        await this.getDevicePermissions({ type: item.type });
        redirectPath("/system/overview");
      } else {
        redirectPath("/system/status");
      }
    },
  },
  computed: {
    ...device_getters(["allDevices", "version"]),
    sn() {
      return (sn) =>
        sn.substring(0, 4) + "..." + sn.substring(sn.length - 7, sn.length);
    },
  },
  watch: {
    allDevices(newVal) {
      if (!newVal.length && this.flag) {
        return showMessage("error", "该电站无任何设备");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.onLine {
  color: $colorful-1 !important;
}

.device-content {
  position: absolute;
  top: 0;
  right: 0px;
  width:140px;
  height: 100%;
  flex-wrap: wrap;
  overflow-y: scroll;
  padding: 10px;
  box-sizing: border-box;
  @include bg-color("1");

  .device-item {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 20px;
    cursor: pointer;
    @include dis-flex(center, center, column);
    padding: 5px;
    box-sizing: border-box;
    .id {
      font-size: 20px;
      font-family: DINCondensed-Bold;
    }
    &:hover {
      img {
        width: 85px;
      }
    }
    img {
      width: 55px;
      margin-bottom: 10px;
      transition: all 0.4s ease-in-out;
    }
  }
}
.v-enter,
.v-leave-to {
  opacity: 1;
  transform: translateX(240px);
}

.v-enter-active,
.v-leave-active {
  opacity: 1;
  transition: all 0.3s ease;
}
</style>
