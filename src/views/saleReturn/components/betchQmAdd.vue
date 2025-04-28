<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <div class="flex">
          <span>企卖销售退货单</span>
          <!-- 上传excel -->
          <el-upload
            :ref="(el) => handleSetUploadRefMap(el)"
            action=""
            :http-request="httpExcelRequest"
            :limit="1"
            :show-file-list="false"
            class="uploadExcelContent"
            :data="{}"
          >
            <el-button type="primary">导入</el-button>
          </el-upload>
        </div>
      </div>
    </template>

    <!-- 搜索 -->
    <el-form ref="queryForm" :inline="true">
      <!-- 列表 -->
      <el-table :data="excelList" show-summary :summary-method="getSummaries">
        <el-table-column align="center" type="index" width="50"> </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品"
          align="center"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="goodsSn" label="货号" width="150" align="center"> </el-table-column>
        <el-table-column prop="sizeName" label="尺码" width="120" align="center">
          <template v-slot="{ row }">
            <el-input style="width: 100%" v-model="row.sizeName"> </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" align="center"></el-table-column>
        <el-table-column prop="price" label="单价" width="120" align="center">
          <template v-slot="{ row }">
            <el-input-number
              style="width: 100%"
              v-model="row.price"
              :precision="2"
              :controls="false"
              :min="0"
            >
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="80" align="center">
          <template v-slot="{ row }">
            {{ (row.price * row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template v-slot="{ row, $index }">
            <div class="btn">
              <el-icon @click="handleDel($index)"><Delete /></el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="operation">
        <el-button type="primary" @click="onSubmit">退货</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import * as xlsx from 'xlsx'
const { proxy } = getCurrentInstance()
const emit = defineEmits(['getData', 'changeOrderSn'])
const uploadRefMap = ref({})
const excelList = ref([])

// 动态设置upload Ref
const handleSetUploadRefMap = (el) => {
  if (el) {
    uploadRefMap.value[`Upload_Ref`] = el
  }
}

// 文件上传自定义
const httpExcelRequest = async (op) => {
  // 获取除文件之外的参数，具体根据实际业务需求来
  console.log(op.data)
  // 获取上传的excel  并解析数据
  let file = op.file
  let dataBinary = await readFile(file)
  let workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true })
  let workSheet = workBook.Sheets[workBook.SheetNames[2]]
  const excelData = xlsx.utils.sheet_to_json(workSheet, { header: 1 })
  excelData.shift()

  console.log(excelData)
  const data = []
  excelData.forEach((item, index) => {
    if (index < 3) return
    let sizeName = item[8].split(' ')
    sizeName = sizeName[sizeName.length - 1]
    const filter = data.filter((value) => value.goodsName == item[5] && value.sizeName == sizeName)
    if (filter.length) {
      console.log(filter[0])
      filter[0].quantity = filter[0].quantity + 1
      filter[0].totalPrice = filter[0].totalPrice + Math.abs(item[76])
      filter[0].price = filter[0].totalPrice / filter[0].quantity
    } else {
      data.push({
        goodsName: item[5],
        goodsSn: item[6].split(',')[0],
        sizeName: sizeName,
        quantity: 1,
        price: Math.abs(item[76]),
        totalPrice: Math.abs(item[76])
      })
    }
  })

  excelList.value = data
  console.log(data)
  if (uploadRefMap.value[`Upload_Ref`]) {
    uploadRefMap.value[`Upload_Ref`].clearFiles()
  }
}

const readFile = (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = (ev) => {
      resolve(ev.target?.result)
    }
  })
}

/**
 * @description
 * @param
 * @return
 */

const getSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 1) {
      sums[index] = '合计'
      return
    }

    if (index == 4 || index == 6) {
      const values = data.map((item) => {
        if (index == 4) {
          return Number(item[column.property])
        } else {
          return Number(item.price * item.quantity)
        }
      })
      if (!values.every((value) => isNaN(value))) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        if (index == 6) {
          sums[index] = sums[index].toFixed(2)
        }
      } else {
        sums[index] = 'N/A'
      }
    }
  })

  return sums
}

/**
 * @description 点击采购
 * @param
 * @return
 */
const onSubmit = async () => {
  if (!excelList.value.length) {
    proxy.$message({
      type: 'warning',
      message: '请选择商品'
    })
    return
  }

  const { code, data, message } = await VE_API.sale.saleBatchAdd({
    itemType: 2,
    goods: excelList.value
  })

  if (code == 200) {
    excelList.value = []
    emit('getData')
    emit('changeOrderSn', data.saleSn)
    proxy.$message({
      type: 'success',
      message: message
    })
  }
}

/**
 * @description 删除一行
 * @param
 * @return
 */
const handleDel = (index) => {
  excelList.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.grey {
  color: #afafaf;
}
.btn {
  i {
    cursor: pointer;
    margin: 0 5px;
  }
}
.operation {
  text-align: center;
  margin-top: 20px;
}

.flex {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
