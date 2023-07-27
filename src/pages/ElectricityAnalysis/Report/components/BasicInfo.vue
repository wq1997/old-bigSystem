<!-- 基础数据表格 -->
<template>
    <div class="BasicInfo">
        <table class="common-table">
            <tr class="row" v-for="rowItem in Math.ceil(allTable.length / 3)">
                <template v-for="index in 4">
                    <td class="item-title" v-if="allTable[index-1 + (rowItem - 1) * 4] !== undefined">
                        {{ allTable[index-1 + (rowItem - 1) * 4].name }}</td>
                    <td class="item-text" v-if="allTable[index-1 + (rowItem - 1) * 4] !== undefined">{{
                        allTable[index-1 + (rowItem - 1) * 4].value }}</td>
                </template>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: "BasicInfo",
    props: ['basicInfo'],
    data() {
        return {
            allTable: []
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
    watch: {
        basicInfo: {
            handler: function (newVal, oldVal) {
                this.allTable = [];
                for (let item in newVal) {
                    this.allTable.push(newVal[item]);
                };
            },
            deep: true,
            immediate: true,
        },
    }

}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.common-table {
    width: 100%;
    min-height: auto;
    border-collapse: collapse;
    border: 1px solid #d9d9d9;

    .row {
        border-bottom: 1px solid #d9d9d9;

        .item-title {
            @include bg-color(1);
            width: 14%;
            padding: 10px 8px;
            font-size: 16px;
            border: 1px solid #d9d9d9;
            @include font-color("1");
            text-align: center;
        }

        .item-text {
            font-size: 16px;
            position: relative;
            padding: 10px 8px;
            @include font-color("1");
            text-align: center;

        }
    }
}

tr td {
    height: 28px;
}
</style>