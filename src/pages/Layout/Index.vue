<template>
    <div class="layout">
        <Header></Header>
        <Main></Main>
        <Footer></Footer>
    </div>
</template>

<script>
export default {
    name: "layout",
    components: {
        Header: (_) => import("./components/Header"),
        Main: (_) => import("./components/Main"),
        Footer: (_) => import("@/components/Footer"),
    },
};
</script>

<style lang="scss" scoped>
.layout {
    @include bg-color("1");
    position: relative;
    padding: 80px 0 0 0;
    box-sizing: border-box;
}
</style>
