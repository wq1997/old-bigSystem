<template>
    <transition mode="out-in">
        <slot> </slot>
    </transition>
</template>

<script>
export default {
    name: "TransitionWrapper",
};
</script>

<style>
.v-enter,
.v-leave-to {
    opacity: 0;
    transform: translateX(10px);
}

.v-enter-active,
.v-leave-active {
    transition: all 0.6s ease;
}
</style>
