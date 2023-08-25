<!--
 * @Author: your name
 * @Date: 2021-01-07 09:49:29
 * @LastEditTime: 2021-04-26 13:51:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\App.vue
-->
<template>
    <router-view />
</template>

<script>
export default {
    name: "App"
};
</script>
<style lang="scss">
.goods-info {
    display: flex;
    align-items: center;

    .goods-img {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        margin-right: 12px;

        img {
            width: 60px;
        }
    }

    .goods-name {
        flex: 1;
        color: #7f7f8e;

        p {
            margin: 0;
        }
    }
}
</style>
