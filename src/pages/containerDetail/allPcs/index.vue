<template>
  <div class="all_pcsWrap">
    <template v-for="item,index in PCS">
      <PcsBox :pcs="item"/>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import IconBox from '../../Overview/components/Graph/components/IconBox.vue'
import AnimatePath from '../../Overview/components/Graph/components/AnimatePath.vue'
import PcsBox from '../AllPcs/compoents/singlePcs.vue'

const {
  mapActions: device_actions,
  mapGetters: device_getters,
  mapMutations: device_mutations
} = createNamespacedHelpers("device")
export default {
  props: {},
  data() {
    let pcsAnimatePath = 'M 0 10 H 10000'

    return {
      pcsAnimatePath,
      direction: 'stop',
      
    };
  },
  watch: {
    PCS:{
      handler(newD,oldD){
        console.log(newD);
      },
      immediate:true,
      deep:true
    }
  },
  computed: {
    ...device_getters(["PCS"]),
  },
  methods: {},
  created() { },
  mounted() { 
    
  },
  components: {
    IconBox,
    AnimatePath,
    PcsBox
  },
};
</script>
<style lang="scss" scoped>
.all_pcsWrap {
  width: 100%;
  height: 100%;
  @include bg-color("2");
  padding: 30px 30px;
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: repeat(2, 50%);
  grid-template-rows:  repeat(2, 50%);
  .all_pcs {
    width: 80%;
    height: 70%;
    border: 2px dashed #909399;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    .pcs {
      width: 50%;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      .path {
        position: absolute;
        left: 0;
        right: 0;
        height: 12px;
      }
    }

  }

  .all_pcs:before {
    content: '';
    position: absolute;
    left: 10%;
    top: 0;
    bottom: auto;
    right: auto;
    height: 5px;
    width: 80%;
    background-color: #909399;
  }

  .all_pcs:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: auto;
    right: auto;
    height: 85%;
    width: 5px;
    background-color: #909399;
  }
}
</style>