<template>
  <svg class="svg" version="1.1">
    <path
      :key="path"
      :d="path"
      fill="none"
      :stroke="options.active ? 'red' : '#999'"
      stroke-width="3"
      stroke-dasharray="4"
      :class="com_direction"
    />
  </svg>
</template>

<script>
export default {
  name: "AnimatePath",
  props: ["path", "options"],
  computed: {
    com_direction() {
      let { active, direction } = this.options;
      return active ? (direction ? direction : "forward") : "";
    },
    
  },
  mounted(){
  }
};
</script>

<style lang="scss" scoped>
.forward {
  animation: forward 0.4s linear infinite;
}
@keyframes forward {
  100% {
    stroke-dashoffset: -8;
  }
}
.backward {
  animation: backward 0.4s linear infinite;
}
@keyframes backward {
  100% {
    stroke-dashoffset: 8;
  }
}

.stop{
  animation: stop 0.4s linear infinite;

}
@keyframes stop {
  100% {
    stroke-dashoffset: 0;
  }
}
.svg {
  width: 100%;
  height: 320px;
}
</style>
