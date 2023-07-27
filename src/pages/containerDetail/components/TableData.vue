<template>
    <div class="wrapper">
      <div class="table">
        <div class="title">
          <div>
            {{ data.title }} {{ currentIndex }}
            <i class="arrow el-icon-caret-left" @click="changeIndex(-1)"></i>
            <i class="arrow el-icon-caret-right" @click="changeIndex(1)"></i>
            ({{ $translate("共") }} {{ data.arr.length }} {{ $translate("组") }})
          </div>
          <span
            @click="handleCollapse"
            class="el-icon-d-arrow-right collapse-icon"
            :style="
              !isCollapse
                ? {
                    transform: 'rotate(0deg)',
                  }
                : {
                    transform: 'rotate(90deg)',
                  }
            "
          ></span>
        </div>
        <div
          class="content"
          :style="
            !isCollapse
              ? {
                  height: 0,
                }
              : {
                  height: Object.keys(data.arr[currentIndex - 1]?data.arr[currentIndex - 1]:{}).length* 33 + 'px'||0,
                }
          "
        >
          <div
            v-for="(item, index) in data.arr[currentIndex - 1]"
            :key="index"
            class="value"
          >
            <span>{{ index}}</span>
            <span class="num">{{ item }} </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Table",
    props: {
      data: {
        type: Object,
        default: (_) => {},
      },
    },
    data() {
      return {
        currentIndex: 1,
        isCollapse: false,
      };
    },
    mounted() {
    },
    methods: {
      changeIndex(step) {
        let resIndex = this.currentIndex + step;
        if (resIndex === 0 || resIndex === this.data.arr.length + 1||this.data.arr.length===0) return;
        this.currentIndex += step;
      },
      handleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .wrapper {
    padding: 10px;
    @include bg-color("2");
    border-radius: 8px;
    margin-bottom: 10px;
    .table {
      border: 1px solid rgb(136, 125, 125);
      height: fit-content;
      .title {
        padding: 8px;
        box-sizing: border-box;
        @include font-color("1");
        display: flex;
        justify-content: space-between;
        .arrow {
          cursor: pointer;
        }
        .collapse-icon {
          cursor: pointer;
          transition: all 0.5s;
        }
      }
      .content {
        transition: height 0.5s;
        overflow: hidden;
        div {
          @include dis-flex(center, stretch);
          border-top: 1px solid #999;
          span {
            padding: 0 8px;
            height: 32px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 0;
            flex: 1;
            box-sizing: border-box;
            word-wrap: break-word;
            &:nth-child(1) {
              border-right: 1px solid #999;
            }
            &.num {
              font-family: DINCondensed-Bold;
              font-size: 16px;
              @include font-color("1");
            }
          }
        }
      }
    }
  }
  </style>
  