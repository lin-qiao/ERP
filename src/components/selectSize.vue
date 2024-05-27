<template>
  <div class="select-size">
    <el-dialog title="选择尺码" :model-value="visible">
      <el-table :data="[sizes]">
        <el-table-column v-for="item in column" :label="item.sizeName" align="center">
          <template v-slot="{ row }">
            <el-input-number
              style="width: 100%"
              v-model="row[item.sizeName].number"
              :controls="false"
              :disabled="type == 'reduce' ? row[item.sizeName].numberStored == 0 : false"
              :max="type == 'reduce' ? row[item.sizeName].numberStored : 99"
            >
            </el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <h4>库存</h4>
      <el-table :data="[sizes]">
        <el-table-column v-for="item in column" :label="item.sizeName" align="center">
          <template v-slot="{ row }">
            {{ row[item.sizeName].numberStored }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, toRefs, onMounted, getCurrentInstance } from 'vue'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    goodsId: {
      type: Number
    },
    type: {
      type: String, //add 增加  reduce 减少库存
      default: 'add'
    }
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const { goodsId } = toRefs(props)
    const column = ref([])
    const sizes = ref({})

    /**
     * @description 点击取消
     * @param
     * @return
     */
    const handleClose = () => {
      emit('update:visible', false)
    }

    /**
     * @description 点击确定
     * @param
     * @return
     */
    const handleConfirm = () => {
      const list = Object.values(sizes.value).filter((item) => item.number && item.number != 0)
      if (!list.length) {
        proxy.$message({
          type: 'warning',
          message: '请选择尺码'
        })
        return
      }
      emit('confirm', list)
      emit('update:visible', false)
    }

    /**
     * @description 获取当前商品库存信息
     * @param
     * @return
     */

    const getGoodsStock = async () => {
      const { code, data } = await VE_API.stock.getGoodsStock({ goodsId: goodsId.value })
      if (code == 200) {
        column.value = data
        data.forEach((item) => {
          sizes.value[item.sizeName] = {
            sizeId: item.sizeId,
            sizeName: item.sizeName,
            numberStored: item.number,
            number: ''
          }
        })
      }
    }

    onMounted(async () => {
      await getGoodsStock()
    })
    return {
      handleClose,
      handleConfirm,
      getGoodsStock,
      sizes,
      column
    }
  }
}
</script>

<style scoped lang="scss">
.select-size {
  &:deep(.el-table .cell) {
    padding: 0;
  }
  &:deep(.el-input__inner) {
    border-radius: 0;
  }
}
</style>
