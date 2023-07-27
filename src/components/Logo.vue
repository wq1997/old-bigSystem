<template><div id="logo"></div></template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters: user_getters } = createNamespacedHelpers("user");
export default {
    name: "Logo",
    computed: {
        ...user_getters(["userInfo"]),
    },
    mounted() {
        const logoWrapperWidth = 120;
        const logoWrapperHeigth = 60;
        const img = new Image();
        img.src = this.userInfo.headImg;
        img.onload = function () {
            let n = 1; // 缩放比
            if (img.width > img.height) {
                n = logoWrapperWidth / img.width;
                img.width = logoWrapperWidth;
                img.height = img.height * n;
            } else {
                n = logoWrapperHeigth / img.height;
                img.height = logoWrapperHeigth;
                img.width = img.width * n;
            }
            document.getElementById("logo").appendChild(img);
        };
    },
};
</script>

<style scoped lang="scss">
#logo {
    width: 120px;
    height: 60px;
    margin-right: 20px;
    outline: 1px solid;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
