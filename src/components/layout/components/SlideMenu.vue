<template>
    <el-submenu
		:index="menu.label"
        v-if="menu.children && menu.children.length"
    >
        <template v-slot:title>
            <span>{{ menu.label }}</span>
        </template>
        <slide-menu
            v-for="child in menu.children"
            :index="child.url"
            :menu="child"
        ></slide-menu>
    </el-submenu>
    <el-menu-item
        v-else
		:index="menu.url"
        @click="clickMenu(menu)"
    >
        <template #title>{{ menu.label }}</template>
    </el-menu-item>
</template>

<script>
import { useRouter } from "vue-router";
export default {
    props: ["menu"],
    setup() {
        // const reload = inject("reload");
        const router = useRouter();
        const clickMenu = menu => {
            router.push(menu.url);
        };
       
        return {
            router,
            clickMenu,
        };
    }
};
</script>

<style lang="scss">
li.el-menu-item.is-active {
    background-color: darken($sideBgColor, 15%) !important;
}
</style>
