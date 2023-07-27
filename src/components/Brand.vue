<template>
    <div class="brand">
        <img :src="userInfo.headImg" alt="" />
        <div class="plant-sn" v-if="NavType==='nav'">
            <span>{{ currentPlant.name }}</span>
            <span class="sn" v-if="currentDevice.sn">{{
                currentDevice.sn
            }}</span>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapGetters: user_getters } = createNamespacedHelpers("user");
const { mapGetters: plant_getters } = createNamespacedHelpers("plant");
const { mapGetters: device_getters } = createNamespacedHelpers("device");

export default {
    name: "Brand",
    props:["NavType"],
    computed: {
        ...user_getters(["userInfo"]),
        ...plant_getters(["currentPlant"]),
        ...device_getters(["currentDevice"]),
    },
};
</script>

<style scoped lang="scss">
.brand {
    @include dis-flex(center, center);
    img {
        width: 120px;
        height: 40px;
        margin-right: 20px;
        margin-left: 20px;

    }
    .plant-sn {
        @include dis-flex(center, flex-start, column);
        font-size: 20px;
        font-weight: bolder;
        @include font-color("1");
        font-family: fangsong;
        .sn {
            font-size: 15px;
            margin-top: 8px;
            font-weight: normal;
            font-family: DINCondensed-Bold;
        }
    }
}
</style>
