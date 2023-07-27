<template>
    <div class="footer">
        <span>{{ userInfo.company }}</span>
        <span> {{ userInfo.address }}</span>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters: user_getters } = createNamespacedHelpers("user");

export default {
    name: "Footer",
    computed: {
        ...user_getters(["userInfo"]),
    },
};
</script>

<style scoped lang="scss">
.footer {
    height: 30px;
    @include dis-flex(space-between, center);
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 12px;
    border-radius: 5px;
    @include bg-color("2");
    @include font-color("1");
}
</style>
