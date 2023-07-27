<template>
  <div>
    <el-dialog width="1200px" title="故障预警" :visible.sync="outerVisible">
      <div class="wrapper">
        <div class="left">
          <ul style="list-style-type: none">
            <li>报警类型：电芯高温</li>
            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>
            <li>级&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：I 级</li>
            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>
            <li>故障类型：高温故障</li>
            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>
            <li>保护措施：检测空调是否运行正常、内部温度传感器排查</li>
          </ul>
        </div>
        <div class="right" style="width: 60%">
          <span
            style="
              width: 70%;
              text-align: center;
              display: block;
              fontsize: 16px;
              font-weight: 800;
            "
          >
            倒计时：<span v-on="m">{{ m }}</span
            >: <span v-on="s">{{ s }}</span></span
          >
          <img src="../../../assets/images/A.png" alt="" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Test",
  props: {},
  data() {
    return {
      outerVisible: true,
      timer: null,
      m: 0,
      s: 0,
    };
  },
  watch: {},
  computed: {},
  methods: {
    resetTime(time) {
      this.m = Math.floor(time / 60);
      this.m = this.m < 10 ? `0${this.m}` : this.m;
      this.s = Math.floor(time % 60);
      this.timer = setInterval(this.countDown, 1000);
    },
    countDown() {
      this.s--;
      this.s < 10 && (this.s = "0" + this.s);
      // this.s = this.s < 10 ? `0${this.s}` : this.s;
      if (this.s.length >= 3) {
        this.s = 59;
        this.m = `0${Number(this.m) - 1}`;
      }
      if (this.m.length >= 3) {
        this.m = "00";
        this.s = "00";
        clearInterval(this.timer);
      }
      this.time = `${this.m}分钟${this.s}秒`;
      console.log(this.m + "分钟" + this.s + "秒");
    },
  },
  created() {
    this.resetTime(125);
  },
  mounted() {},
  components: {},
};
</script>
<style lang="scss" scoped>
ul {
  margin-top: 50px;

  li {
    height: 30px;
    font-size: 16px;
  }
}

.wrapper {
  display: flex;
  justify-content: space-around;
}
</style>