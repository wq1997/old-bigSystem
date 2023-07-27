<template>
  <div>
    <div class="box-card">
      <div class="card-title">
        <span>SOC</span>
        <span
          >SOH
          <span class="title-text">{{BMS.soh}}%</span>
        </span>
      </div>
      <div class="card-content">
        <span class="big-text">{{BMS.soc}}%</span>
        <el-progress
          :percentage="BMS.soc"
          color="#3af3a7"
          :show-text="false"
        ></el-progress>
        <div class="content-bottom">
          <div class="content-left">
            <p>{{$translate("堆累计充电电量") }} </p>
            <p class="big-text">{{BMS.ei}}<span class="unit">KWh</span></p>
          </div>
          <div class="content-right">
            <p>{{$translate("堆累计放电电量") }}</p>
            <p class="big-text">{{BMS.eo}}<span class="unit">KWh</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["BMS"],
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
  components: {},
};
</script>
<style lang="scss" scoped>
.unit {
  color: $text-color;
  font-size: 20px;
  display: inline-block;
  margin-left: 10px;
}
.box-card {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  min-height: 300px;
  .card-title:global(.card-title) {
    justify-content: space-between;
    height: 10%;
    margin-bottom: 5%;
    margin-top: 2%;
    .title-text {
      display: inline-block;
      width: 70px;
      font-size: 20px;
      @include font-color("1");

    }
  }
  .card-content {
    padding: 0 20px;
    font-weight: bolder;
    height: 80%;
    .big-text {
      font-size: 24px;
      display: inline-block;
      @include font-color("1");

      padding: 0 0 15px 0;
    }
    .content-bottom {
      margin-bottom: 10%;
      width: 100%;
      display: flex;
      .content-left,
      .content-right {
        box-sizing: border-box;
        padding: 10px;
        width: 50%;
        height: 100%;
        margin-top: 8%;
        @include dis-flex(center, center);
        p{
          width: 100%;
          text-align: center;
          margin-bottom: 8%;
        }
      }
    }
  }
}
</style>