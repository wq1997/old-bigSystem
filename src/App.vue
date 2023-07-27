<template>
    <div id="app" :data-theme="systemTheme">
        <TransitionWrapper key="1">
            <router-view />
        </TransitionWrapper>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters: app_getters } = createNamespacedHelpers("app");
const { mapActions: user_actions } = createNamespacedHelpers("user");
export default {
    name: "App",
    components: {
        TransitionWrapper: (_) => import("@/components/TransitionWrapper"),
    },
    computed: {
        ...app_getters(["systemTheme"]),
    },
    mounted() {
        this.subscribeAlarm();
        this.getActiveCount();
    },
    methods: { ...user_actions(["subscribeAlarm", "getActiveCount"]) },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
    display: none;
}
</style>
