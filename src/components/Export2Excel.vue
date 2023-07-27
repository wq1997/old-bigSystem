<template>
    <el-button size="mini" type="warning" @click="export2Excel">
        ↓ {{ buttonText || "Excel" }}
    </el-button>
</template>

<script>
export default {
    name: "Export2Excel",
    props: ["header", "title", "data", "fields", "buttonText"],
    methods: {
        export2Excel() {
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/excel/Export2Excel.js')  //刚刚新建Export2Excel.js文件的路径
                const autoWidth = true
                const filename = this.title
                const bookType = 'xlsx'
                const header = []
                const headValue = []
                const list = this.data   //table数据
                const merges = [
                    'A1:H1', // 地区
                    // 'B1:R1', 'B2:F2', 'G2:K2', 'L2:Q2', 'R2:R3', // 家畜
                    // 'S1:AM1', 'S2:X2', 'Y2:AD2', 'AE2:AJ2', 'AK2:AK3', 'AL2:AL3', 'AM1:AM1', 'AM2:AM3', // 家禽
                    // 'AN1:AN1', 'AN2:AN3', // 蜂
                    // 'AO1:AO3', // 实验性动物
                    // 'AP1:BF1', 'AP2:AP3', 'AQ2:AQ3', 'AR2:AR3', 'AS2:AS3', 'AT2:AT3', 'AU2:AU3', 'AV2:AV3', 'AW2:AW3', 'AX2:AX3', 'AY2:AY3', 'AZ2:AZ3', 'BA2:BA3', 'BB2:BB3', 'BC2:BE2', 'BF2:BF3', // 特殊畜禽
                    // 'BG1:BJ1', 'BG2:BG3', 'BH2:BH3', 'BI2:BI3', 'BJ2:BJ3', // 野生动物
                    // 'BK1:BK3', 'BL1:BL3', 'BM1:BM3', 'BN1:BN3'
                ]
                const multiHeader = [
                "abc",
                ]
                const data = this.formatJson(headValue, list);
                export_json_to_excel({
                    multiHeader,
                    header,
                    // this.exportData 是后端获取的数据
                    data,
                    filename,
                    autoWidth,
                    bookType,
                    merges
                });  //导出文件名称
            })
        },
        formatJson(filterVal, jsonData) {
            console.info(jsonData)
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        port() {
            this.export2Excel()
        },
    },
    watch: {
        data: {
            deep: true,
            handler(a, b) {
                console.log(this.header,111111111111);
            }
        },
        fields: {
            handler(a, b) {
            },
            deep: true,
        }
    }
};
</script>

<style></style>
