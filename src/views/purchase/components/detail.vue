<template>
  <el-card class="card">
    <template #header>
      <div class="card-header">
        <span>采购单</span>
        <el-button type="primary" size="small" @click="handleAdd">新增采购</el-button>
      </div>
    </template>
    <el-form>
      <el-form-item label="供应商：">
        {{ detail.supplierName }}
      </el-form-item>
    </el-form>
    <table-com style="min-height: 240px" :columns="tableColumn" :data="tableData"> </table-com>
    <div class="operation" v-if="detail.status == 1">
      <el-button type="primary" @click="onSubmit">撤销</el-button>
    </div>
    <div class="status" v-if="detail.status == 2">
      <img src="@/assets/destroyMark.png" alt="" />
    </div>
  </el-card>
</template>

<script>
import { useStore } from 'vuex'
import tableColumn from './tableColumn'
import { ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue'

export default {
  props: {
    orderSn: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const store = useStore()
    const detail = ref({})
    const tableData = ref([])
    const { orderSn } = toRefs(props)

    /**
     * @description  商品列表
     * @param
     * @return
     */
    const getData = async (purchaseSn) => {
      const { code, data } = await VE_API.purchase.purchaseDetail({ purchaseSn })
      if (code == 200) {
        detail.value = data
        tableData.value = data.goods
      }
    }
    /**
     * @description 撤销
     * @param
     * @return
     */
    const onSubmit = async () => {
      const { code, data, message } = await VE_API.purchase.purchaseBackout({
        purchaseSn: orderSn.value,
        itemType: 1
      })
      if (code == 200) {
        detail.value.status = 2
        emit('getData')
        proxy.$message({
          type: 'success',
          message: message
        })
      }
    }

    /**
     * @description 新增采购
     * @param
     * @return
     */
    const handleAdd = () => {
      emit('changeOrderSn', null)
    }
    return {
      tableColumn,
      tableData,
      onSubmit,
      handleAdd,
      getData,
      detail
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  position: relative;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.operation {
  text-align: center;
  margin-top: 20px;
}

.status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 190px;
  height: 250px;
}
</style>
