<template>
  <!-- 搜索 -->
  <el-form ref="queryForm" :inline="true" :model="params">
    <el-form-item prop="orderTime" label="月份">
      <el-date-picker
        v-model="time"
        type="monthrange"
        value-format="YYYY-MM"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeTime"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">搜索</el-button>
    </el-form-item>
  </el-form>
  <div class="sale-sum">
    <div class="sale-sum-item">
      <span class="tit">总销售额</span>
      <span class="con">￥ {{ formatMoney(count.allTransactionPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">退货退款销售额</span>
      <span class="con">￥ {{ formatMoney(count.returnTransactionPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">销售额</span>
      <span class="con">￥ {{ formatMoney(count.transactionPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">总成本</span>
      <span class="con">￥ {{ formatMoney(count.allCostPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">退货退款成本</span>
      <span class="con">￥ {{ formatMoney(count.returnCostPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">成本</span>
      <span class="con">￥ {{ formatMoney(count.costPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">利润</span>
      <span class="con">￥ {{ formatMoney(count.profitPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">销售毛利率(%) </span>
      <span class="con">{{ count.grossProfitRate }}</span>
    </div>
  </div>
</template>
<script setup lang="jsx">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance //获取当前组件实例
} from 'vue'
import { useRoute } from 'vue-router'
import { formatMoney } from '@/utils/index'

const { proxy } = getCurrentInstance()

const count = ref({})
const time = ref([])

/* 请求参数 */
const params = reactive({
  startTime: '',
  endTime: ''
})

const route = useRoute()

onMounted(async () => {})

const changeTime = () => {
  params.startTime = time.value?.[0] || ''
  params.endTime = time.value?.[1] || ''
}

const handleSubmit = () => {
  getCount()
}
/**
 * @description
 * @param
 * @return
 */
const getCount = async () => {
  const { code, data } = await VE_API.order.taxFilingCount({
    startTime: params.startTime,
    endTime: params.endTime
  })
  if (code == 200) {
    count.value = data
  }
}
</script>
<style scoped lang="scss">
.sale-sum {
  margin-bottom: 10px;
  .sale-sum-item {
    width: 25%;
    padding: 5px 0;
    border: 1px solid #d7d7d7;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    box-sizing: border-box;
    float: left;
    .tit {
      font-size: 14px;
    }

    .con {
      margin-left: 10px;
      font-size: 24px;
      color: #fe3800;
      line-height: 31px;
      font-family: 'Microsoft YaHei', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
  }
}
</style>
