<!--
 * @Author: your name
 * @Date: 2021-01-07 16:21:00
 * @LastEditTime: 2021-03-22 14:30:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\components\layout\SideBar.vue
-->
<template>
  <div class="logo">进销存系统</div>
  <div class="ve_el_menu" :style="styles">
    <el-scrollbar>
      <el-menu
        :default-active="defaultActive"
        :collapse="opened"
        :collapseTransition="false"
        unique-opened
        :background-color="sideBgColor"
        :text-color="sideTextColor"
        :active-text-color="sideActiveTextColor"
      >
        <slide-menu v-for="(item, index) in menus" :key="index" :menu="item"></slide-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  nav_height,
  sideBgColor,
  sideTextColor,
  sideActiveTextColor
} from '@/styles/variables.scss.js'
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SlideMenu from './components/SlideMenu'
export default {
  components: {
    SlideMenu
  },
  setup() {
    const styles = {
      '--nav_height': nav_height
    }
    const store = useStore()
    const route = useRoute()
    const opened = computed(() => store.getters.opened)
    // const menus = computed(() => store.getters.menuList);
    const menus = reactive([
      {
        label: '大类管理',
        url: '/category'
      },
      {
        label: '品牌管理',
        url: '/brand'
      },
      {
        label: '尺码管理',
        url: '/size'
      },
      {
        label: '供应商管理',
        url: '/supplier'
      },
      {
        label: '商品管理',
        url: '/goods'
      },
      {
        label: '库存管理',
        name: 'stockSys',
        children: [
          { label: '库存列表', url: '/stock' },
          { label: '库存流水', url: '/businessFlow' }
        ]
      },
      {
        label: '采购管理',
        name: 'purchaseSys',
        children: [
          { label: '采购商品', url: '/purchase' },
          { label: '采购退货', url: '/purchaseReturn' }
        ]
      },
      {
        label: '销售管理',
        name: 'saleSys',
        children: [
          { label: '销售商品', url: '/sale' },
          { label: '销售退货', url: '/saleReturn' },
          { label: '批量销售', url: '/batchSale' },
          { label: '批量退货', url: '/batchSaleReturn' }
        ]
      },
      {
        label: '统计报表',
        name: 'StatSys',
        children: [
          { label: '采购统计', url: '/purchaseStat' },
          { label: '销售统计', url: '/saleStat' }
        ]
      },
      {
        label: '计算器',
        url: '/calculator'
      }
      // {
      //   label: '购物金',
      //   url: '/gwj'
      // }
    ])
    const defaultActive = computed(() => {
      return route.path
    })

    return {
      sideBgColor,
      sideTextColor,
      sideActiveTextColor,
      styles,
      opened,
      menus,
      defaultActive,
      nav_height
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  height: 50px;
  color: #2c3e50;
  font-size: 1.3rem;
  text-align: center;
  line-height: 50px;
}
a:active {
  color: #f11111;
}

.ve_el_menu {
  background: $sideBgColor;
  height: calc(100vh - var(--nav_height));
}
</style>
