<template>
  <div id="video-box">
    <div>
      <div id="video1"></div>
    </div>
    <div>
      <div id="video2"></div>
    </div>
    <div>
      <div id="video3"></div>
    </div>
    <div>
      <div id="video4"></div>
    </div>
  </div>
</template>

<script>
//import   '../../../lib/cyberplayer.js'
import { apiGetVideo,apiGetNewHLS } from "@/api/device";
import { createNamespacedHelpers } from "vuex";
import { showMessage } from "@/common/utils";
const { mapGetters: device_getters } = createNamespacedHelpers("device");
export default {
  name: "UserManage",
  data() {
    return {
      player1: null,
      player2: null,
      player3: null,
      player4: null
    };
  },
  mounted() {
    this.getVideo();
  },
  computed: {
    ...device_getters(["currentDevice","version"])
  },
  methods: {
    getOptions(file) {
      return {
        width: "100%", // 宽度，也可以支持百分比（不过父元素宽度要有）
        height: "100%", // 高度，也可以支持百分比
        title: "", // 标题
        isLive: true, // 必须设置，表明是直播视频
        file,
        autostart: true, // 是否自动播放
        stretching: "uniform", // 拉伸设置
        repeat: false, // 是否重复播放
        volume: 0, // 音量，注：仅当用户同意、网站由用户激活或媒体无声时允许自动播放
        controls: false, // 是否显示控制栏
        controlbar: {
          barLogo: false
        },
        hls: {
          reconnecttime: 5 // hls直播重连间隔秒数
        },
        ak: "39f82ac87fc3462ea4dcc78734450f57" // 百度智能云平台注册（https://cloud.baidu.com）即可获得accessKey
      };
    },
    async getVideo() {
      if (this.version=="2") {
      let { data, msg } = await apiGetNewHLS({ containerId: sessionStorage.getItem("containerId") });
      if (msg) {
        return;
      }
      if (!data.length) {
        return;
      }
      let [url1, url2, url3, url4] = data;
      this.player1 = cyberplayer("video1").setup(this.getOptions(url1));
      this.player2 = cyberplayer("video2").setup(this.getOptions(url2));
      this.player3 = cyberplayer("video3").setup(this.getOptions(url3));
      this.player4 = cyberplayer("video4").setup(this.getOptions(url4));
      return;
      }
      let { data, msg } = await apiGetVideo({ dtuId: this.currentDevice.id });
      if (msg) {
        return;
        showMessage("error", this.$translate("暂未接入摄像头"));
      }
      if (!data.length) {
        return;
        showMessage("error", this.$translate("暂未接入摄像头"));
      }
      let [url1, url2, url3, url4] = data;
      this.player1 = cyberplayer("video1").setup(this.getOptions(url1));
      this.player2 = cyberplayer("video2").setup(this.getOptions(url2));
      this.player3 = cyberplayer("video3").setup(this.getOptions(url3));
      this.player4 = cyberplayer("video4").setup(this.getOptions(url4));
    }
  },
  beforeDestroy() {
    this.player1.remove();
    this.player2.remove();
    this.player3.remove();
    this.player4.remove();
  }
};
</script>

<style lang="scss" scoped>
#video-box {
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  > div {
    width: calc(50% - 20px);
    height: 50%;
    background: #000;
    margin: 10px;
  }
}
</style>
