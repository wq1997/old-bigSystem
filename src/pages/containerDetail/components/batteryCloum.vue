<template>
  <div class="container">
    <div class="batteryBody"></div>
    <div class="batteryCopy">
      <div class="title"></div>
      <div class="socGroup">
        <span class="socVal">10</span>
        <span class="socUnit">%</span>
      </div>
      <div class="g-wave"></div>
      <div class="g-wave"></div>
      <div class="g-wave"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
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
.container {
  position: relative;
  width: 100%;
  height: 100%;
  .batteryBody {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 20%;
    border: 2px solid #91a09d;
    @include bg-color("2");
    z-index: 1;
    overflow: hidden;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 100%;
      background-color: #3af3a7;
      box-sizing: border-box;
      animation: charging 10s linear infinite;
    }
  }
  .socGroup {
    z-index: 110;
    font-size: larger;
    position: absolute;
    z-index: 2;
    left: 50%;
    transform: translate(-50%, -20%);
    top: 50%;
    text-align: center;
    color: #fff;
    font-family: DINCondensed-Bold;

    .socVal {
      font-size: 50px;
      font-family: DINCondensed-Bold;
    }
    .socUnit {
      font-size: 20px;
    }
  }
  .batteryCopy {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 20%;
    left: 1px;
    top: 1px;
    overflow: hidden;
    right: 1px;
    .title {
      width: 40%;
      border: 0.1px solid rgba($color: #000000, $alpha: 0);
      box-shadow: 0 1px 5px #3af3a7;
      position: absolute;
      top: 0;
      transform: translate(70%, -1px);
      z-index: 100;
    }
  }
}
@keyframes charging {
  50% {
  }

  95% {
    top: 5%;
    filter: hue-rotate(0deg);
  }
  100% {
    top: 0%;
    filter: hue-rotate(0deg);
  }
}
.g-wave {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(28, 42, 57, 0.8);
  border-radius: 45% 47% 44% 42%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
  animation: move 10s linear infinite;
  bottom: 0px;
}

.g-wave:nth-child(2) {
  border-radius: 38% 46% 43% 47%;
  transform: translate(-50%, 0) rotate(-135deg);
}

.g-wave:nth-child(3) {
  border-radius: 42% 46% 37% 40%;
  transform: translate(-50%, 0) rotate(135deg);
}
@keyframes move {
  100% {
    transform: translate(-50%, -160px) rotate(720deg);
  }
}
</style>