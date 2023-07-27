<!--  -->
<template>
    <el-button size="mini" type="warning" @click="exportPdf">
        ↓ {{ buttonText || "PDF" }}
    </el-button>
</template>

<script>
import htmlToPdf from "@/common/htmlToPdf.js"
export default {
    name:"",
    data() {
        return {
            htmlTitle:'页面导出PDF文件名',
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        exportPdf(){
            htmlToPdf.getPdf(this.htmlTitle);
        }
    }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */

</style>