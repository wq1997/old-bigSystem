<!--  -->
<template>
<div class="detailsNav">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <template v-for="item in navData">
            <el-menu-item :key="item.path" :index="item.path">{{$translate(item.name) }}</el-menu-item>
        </template>

</el-menu>

</div>
</template>

<script>
import { redirectPath, deepClone } from "@/common/utils";

export default {
    name:"",
    data() {
        return {
            activeIndex: '1',
            navData:[
                {
                    name:"视屏监控",
                    path:"/containerIndex/equipmentOverview/monitor",
                },
                {
                    name:"数据分析",
                    path:"/containerIndex/equipmentOverview/EnergyManage",
                },
                {
                    name:"报警查询",
                    path:"/containerIndex/equipmentOverview/alarm",
                },
            ]
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        handleSelect(key){
            this.$router.push({
                    path: key, 
                    query: {
                        id:sessionStorage.getItem('containerId')||null,
                    }
                })
            
        }
    }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.detailsNav{
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    .el-menu{
        height: 100%;
        background-color: rgba($color: #000000, $alpha: 0);
        border-left: 1px solid ;
        margin-left: 10px;
        .el-menu-item{
        height: 100%;
            line-height: 40px;
            @include font-color("1");

            border-right: 1px solid ;
            border-top: 1px solid ;
;
        &:hover{
            background-color: rgba($color: #000000, $alpha: 0);
            @include font-color("2");
            color: aquamarine;

        }
        }
        .is-active{
            background-color: rgba($color: #000000, $alpha: 0);
            color: $primary-color;
        }

    }
}
</style>