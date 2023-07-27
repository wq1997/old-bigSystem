<template>
    <div class="header">
        <Brand :NavType="NavType='nav'"/>
        <Nav />
    </div>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            NavType:'nav'
        };
    },
    components: {
        Brand: (_) => import("@/components/Brand"),
        Nav: (_) => import("@/components/Nav"),
    },
};
</script>

<style scoped lang="scss">
.header {
    width: 100%;
    height: 60px;
    padding: 0 40px 0 20px;
    @include bg-color("2");
    box-sizing: border-box;
    @include dis-flex(space-between, center);
    position: fixed;
    top: 0;
    z-index: 1000;
}
</style>
