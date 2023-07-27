<!-- 数据选择模板 -->
<template>
    <div class="DataCard">
        <div class="allCard">
            <div class="card-title">{{ oneCardInfo.label }}</div>
            <div class="card-content">
                <el-checkbox-group v-model="checkedData" @change="checkChange">
                    <template v-for="item in oneCardInfo.children" >
                    <el-checkbox  :label="item.value" :key="item.value" :checked="item.state" >{{ item.label}}</el-checkbox>
                    </template>
                </el-checkbox-group>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DataCard",
    props: ["oneCardInfo"],
    data() {
        return {
            checkedData:[]
        }
    },
    created() {

    },
    mounted() { 
        this.checkChange();
    } ,
    methods: {
       checkChange(){
        this.$emit('getData',this.checkedData,this.oneCardInfo.label)
       } 
    }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.DataCard {
    // padding: 0  0 0 24px;   
    @include font-color("1");
    margin-bottom: 16px;
    .card-title {
        font-weight: bolder;
        font-weight: 900;
    }

    .card-content {
        // width: 100%;
        border: 1px solid $text-color;
        margin: 0 0 0 24px;
        box-sizing: border-box;
        padding: 0 16px 16px 16px;
        .el-checkbox{
            @include font-color("1");
            width: 15%;
            margin-top: 16px;
        }
    }
}
</style>