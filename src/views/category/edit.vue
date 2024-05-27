<template>
  <el-dialog
    :title="title"
    append-to-body
    destroy-on-close
    width="800px"
    :model-value="showDialog"
    @close="closeDialog()"
  >
    <el-form ref="formRef" :model="form" label-width="80px" :rules="rules" :inline="false">
      <el-form-item label="大类名称" prop="categoryName">
        <el-input clearable v-model="categoryName" placeholder="大类名称"></el-input>
      </el-form-item>
      <el-form-item label="选择品牌" prop="brandIds">
        <el-checkbox-group v-model="brandIds" placeholder="请选择选择品牌">
          <el-checkbox v-for="item in brandList" :key="item.id" :label="item.id" :value="item.id">
            {{ item.brand_name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <span>
        <el-button @click="closeDialog()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, toRefs, computed, onMounted } from 'vue'

export default {
  props: {
    title: {
      type: String,
      default: '添加'
    },
    rowData: {
      type: Object,
      default: null
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  emits: ['closeDialog'],
  setup(props, { emit }) {
    const { rowData } = toRefs(props)

    const formRef = ref(null)
    const brandList = ref([])
    const form = reactive({
      categoryName: '',
      brandIds: []
    })
    const { categoryName, brandIds } = toRefs(form)

    /**
     * @description 初始化表单
     * @param
     * @return
     */
    console.log(rowData.value)
    rowData.value &&
      ((form.categoryName = rowData.value.category_name),
      (form.brandIds = rowData.value.brand_ids.split(',').map((item) => parseInt(item))))

    /* 表单规则 */
    const rules = computed(() => ({
      categoryName: {
        required: true,
        message: '请输入大类名称',
        trigger: 'blur'
      },
      brandIds: {
        required: true,
        message: '请选择品牌',
        trigger: 'blur'
      }
    }))

    /**
     * @description 获取品牌列表
     * @param
     * @return
     */
    const getBrandList = async () => {
      const { code, data } = await VE_API.brand.brandList({ page: 1, size: 100 })
      if (code == 200) {
        brandList.value = data
      }
    }

    /* 提交表单 */
    const onSubmit = () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          let res
          if (rowData.value && rowData.value.id) {
            res = await VE_API.category.categoryUpdate({
              id: rowData.value.id,
              categoryName: categoryName.value.trim(),
              brandIds: brandIds.value.join()
            })
          } else {
            res = await VE_API.category.categoryAdd({
              categoryName: categoryName.value.trim(),
              brandIds: brandIds.value.join()
            })
          }
          const { code } = res
          if (code == 200) {
            closeDialog()
          }
        }
      })
    }
    const closeDialog = () => {
      emit('closeDialog', false)
    }

    onMounted(() => {
      getBrandList()
    })
    return {
      formRef,
      form,
      categoryName,
      brandIds,
      brandList,
      onSubmit,
      rules,
      closeDialog
    }
  }
}
</script>

<style></style>
