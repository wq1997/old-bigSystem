<template>
    <download-excel
        class="export-excel-wrapper"
        :header="header"
        :name="title"
        :fields="fields"
        :data="data"
    >
        <el-button size="mini" type="warning" >
            ↓ {{ buttonText || "Excel" }}
        </el-button>
    </download-excel>
</template>

<script>
export default {
    name: "ExportExcel",
    props: ["header", "title", "data", "fields", "buttonText"],
    watch: {
        data:{
            deep:true,
            handler(a,b){
            }
        },
        fields:{
            handler(a,b){
            },
                deep:true,
         }
    }
};
</script>

<style></style>
