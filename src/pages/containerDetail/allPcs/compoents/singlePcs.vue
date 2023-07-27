<template>
  <div class="Pcs_wrap">
    <div class="pcsData">
      <div class="center">
        <span class="title">{{ $translate(pcsData[4].name) }}</span>
        <p class="num">{{ pcsData[4].value }}
          <span class="unit">{{ pcsData[4].unit }}</span>
        </p>
      </div>
      <div class="bottom">
        <div class="chargeQuantity">
          <span class="title">{{ $translate(pcsData[0].name) }}</span>
          <span class="num">{{ pcsData[0].value }}
            <span class="unit">{{ pcsData[0].unit }}</span>
          </span>
        </div>
        <div class="dischargeQuantity">
          <span class="title">{{ $translate(pcsData[1].name) }}</span>
          <span class="num">{{ pcsData[1].value }}
            <span class="unit">{{ pcsData[1].unit }}</span>
          </span>
        </div>

      </div>
    </div>
    <IconBox class="icon" :isActive="true" iconClassName="icon-bingxiang" color="#3af3a7" />
    <div class="pcsData pcsRight">
      <div class="voltage data">
        <span class="title">
          {{ $translate(pcsData[2].name) }}
        </span>
        <p class="num">
          {{ pcsData[2].value }}
          <span class="unit">
            {{ pcsData[2].unit }}
          </span>
        </p>
      </div>
      <div class="electric data">
        <span class="title">
          {{ $translate(pcsData[3].name) }}
        </span>
        <p class="num">
          {{ pcsData[3].value }}
          <span class="unit">
            {{ pcsData[3].unit }}
          </span>
        </p>
      </div>
      <div class="temperature data">
        <span class="title">
          {{ $translate(pcsData[5].name) }}
        </span>
        <p class="num">
          {{ pcsData[5].value }}
          <span class="unit">
            {{ pcsData[5].unit }}
          </span>
        </p>
      </div>
    </div>

  </div>
</template>
  
<script>
import IconBox from '../../../Overview/components/Graph/components/IconBox.vue'

export default {
  props: ["pcs"],
  data() {
    return {
      pcsData: [
        {
          name: '总充电电量',
          value: this.pcs.eiT,
          unit: 'kWh'
        },
        {
          name: '总放电电量',
          value: this.pcs.eoT,
          unit: 'kWh'
        },
        {
          name: '电池电压',
          value: this.pcs.dv,
          unit: 'V'
        },
        {
          name: '电池电流',
          value: this.pcs.dc,
          unit: 'A'
        },
        {
          name: '电池功率',
          value: this.pcs.dp,
          unit: 'kW'
        },
        {
          name: '环境温度',
          value: this.pcs.t,
          unit: '℃'
        }
      ]
    };
  },
  watch: {
    pcs:{
      handler(newD,oldD){
        this.pcs=newD;
        this.pcsData[0].value=this.pcs.eiT;
        this.pcsData[1].value=this.pcs.eoT;
        this.pcsData[2].value=this.pcs.dv;
        this.pcsData[3].value=this.pcs.dc;
        this.pcsData[4].value=this.pcs.dp;
        this.pcsData[5].value=this.pcs.t;
      },
      deep:true,
      immediate:true
    },
   
    },
  computed: {},
  methods: {},
  created() { },
  mounted() {

  },
  components: {
    IconBox,
  },
};
</script>
<style lang="scss" scoped>
.Pcs_wrap {
  width: 93%;
  height: 90%;
 @include bg-color('1');
  // background-color: rgba( 27,37,53,0.6);
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 655px;
  box-shadow:5px 5px 10px gray;
  .icon {
    width: 100px;
    height: 100px;
  }

  .pcsData {
    width: 39%;
    height: 90%;
    padding-top: 20px;

    .center {
      width: 100%;
      height:78%;
      display: flex;
      flex-direction: column;

    

      .num {
        font-size: 60px;
        align-self: center;
        height: 100%;
        padding-top: 23%;
         @include font-color("1");;
        

        .unit {
          font-size: 20px;
        }
      }
    }

    .bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      .num {
        margin: 10px 8px;
        @include font-color("1");
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
.unit{
  @include font-color("1");
  font-size: 16px;
  font-weight: 400;

}
  .pcsRight {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .data {
      height: 30%;
    padding-left: 50px;

      .num{
        text-align: center;
        @include font-color("1");
        margin-top: 25px;
        font-size: 20px;
        font-weight: bold;
        .unit{
          font-size: 16px;
        font-weight: 400;

        }
      }
    }
  }
  .chargeQuantity,.dischargeQuantity{
    display: flex;
    flex-direction: column;
    // padding-right: 20px;
  
  }
  .title {
        font-size: 16px;
      }
}
</style>