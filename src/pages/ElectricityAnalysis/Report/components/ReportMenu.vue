<!-- 报表按钮 -->
<template>
    <div class="menu">
        <el-card class="card-box" >
            <div>
                <div class="middle-icon">
                    <i :class="'iconfont ' + list.icon"></i>
                   
                </div>
                <div class="bottom">
                    <div class="line"></div>
                    <div class="title">
                        {{ $translate(list.title) }}
                    </div>
                    <div class="line"></div>

                </div>

            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Menu",
    props: ["list"],
    data() {
        return {

        }
    },
    created() {

    },
    mounted() {

    }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.menu {
 width: 20%;
}

.card-box {
    margin: 10px;
    cursor: pointer;
    padding: 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    @include bg-color(1);
}

.el-card {
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    color: #303133;
    transition: .3s;
}

.middle-icon {
    width: 52px;
    height: 58px;
    margin: 25px 0 25px 0;
    margin-left: calc(50% - 26px);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .iconfont {
        font-size: 50px;
        color: $colorful_1;
    }
}

.bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    @include font-color("1");

    .line {
        flex: 1;
        height: 1px;
        background: #d9d9d9;
    }

    .title {
        padding: 0 10px;
        font-size: 16px;
        position: relative;
        max-width: 155px;
        overflow: hidden;
        word-break: break-word;
        height: 34px;
        line-height: 34px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}</style>