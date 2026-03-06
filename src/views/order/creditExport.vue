<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <div class="flex" style="width: 100%">
          <span>对账单列表</span>
          <!-- 上传excel -->
          <div class="flex">
            <el-upload
              :ref="(el) => handleSetUploadRefMap(el)"
              action=""
              :http-request="httpExcelRequest"
              :limit="1"
              :show-file-list="false"
              class="uploadExcelContent"
              :data="{}"
            >
              <el-button type="primary">导入对账单</el-button>
            </el-upload>
            <el-button type="primary" style="margin-left: 10px" @click="updateOrder"
              >上传对账单</el-button
            >
          </div>
        </div>
      </div>
    </template>
    <!-- 搜索 -->
    <el-form ref="queryForm" :inline="true">
      <!-- 列表 -->
      <el-table :data="excelList">
        <el-table-column align="center" type="index" width="50"> </el-table-column>
        <el-table-column prop="orderSn" label="订单号" width="200" />
        <el-table-column prop="orderType" label="订单类型" width="100" />
        <el-table-column prop="goodsName" label="商品名称" minWidth="280" showOverflowTooltip />
        <el-table-column prop="goodsSn" label="商品货号" width="250" />
        <el-table-column prop="sizeName" label="尺码" width="150" />
        <el-table-column prop="transactionPrice" label="交易金额" width="150" />
        <el-table-column prop="receivedPrice" label="实际收入金额" width="150" />
        <el-table-column prop="orderTime" label="下单时间" width="250" />
        <el-table-column prop="settlementTime" label="结算时间" width="250" />
        <el-table-column prop="returnTime" label="退货时间" width="250" />
        <el-table-column prop="orderStatus" label="订单状态" width="150" />
      </el-table>
    </el-form>
  </el-card>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue'
import * as xlsx from 'xlsx'
const { proxy } = getCurrentInstance()

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
  let workSheet = workBook.Sheets[workBook.SheetNames[1]]
  const excelData = xlsx.utils.sheet_to_json(workSheet, { header: 1 })
  excelData.splice(0, 3)
  let data = []
  data = excelData.map((item) => {
    let sizeName = item[5].split(' ')
    let goodsSn = item[3].split(',')[0]
    if (item[2].includes('CAMEL骆驼')) {
      goodsSn = goodsSn + sizeName[0]
    }
    sizeName = sizeName[sizeName.length - 1]
    if (sizeName == '2XL') {
      sizeName = 'XXL'
    } else if (sizeName == '3XL') {
      sizeName = 'XXXL'
    }

    return {
      orderSn: item[0],
      orderType: item[1],
      goodsName: item[2],
      goodsSn: goodsSn,
      sizeName: sizeName,
      transactionPrice: item[10],
      receivedPrice: item[83],
      orderTime: item[12],
      settlementTime: item[85],
      returnTime: item[84] == '已撤销' ? item[85] : '',
      orderStatus: item[84]
    }
  })
  console.log(excelData)
  console.log(data)
  excelList.value = data
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
const updateOrder = async () => {
  if (excelList.value.length == 0) {
    proxy.$message({
      type: 'error',
      message: '请先导入对账单数据'
    })
    return
  }
  const { code, data, message } = await VE_API.order.betchOrderEdit({
    orderList: excelList.value
  })

  if (code == 200) {
    excelList.value = []
    proxy.$message({
      type: 'success',
      message: message
    })
  }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
