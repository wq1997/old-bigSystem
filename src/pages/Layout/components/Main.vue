<template>
    <div class="main">
        <TransitionWrapper>
            <router-view />
        </TransitionWrapper>
    </div>
</template>

<script>
export default {
    name: "Main",
    components: {
        TransitionWrapper: (_) => import("@/components/TransitionWrapper"),
    },
};
</script>

<style scoped lang="scss">
.main {
    min-height: 100vh;
    margin-bottom: 20px;
    > div {
        width: 90%;
        min-width: 1100px;
        margin: 0 auto;
    }
}
</style>
