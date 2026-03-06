<template>
  <!-- 搜索 -->
  <el-form ref="queryForm" :inline="true" :model="params">
    <el-form-item label="订单号" prop="orderSn">
      <el-input
        clearable
        style="width: 180px"
        v-model="params.orderSn"
        placeholder="请输入订单号"
        @change="handleSubmit"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="商品" prop="goodsName">
      <el-input
        clearable
        style="width: 180px"
        v-model="params.goodsName"
        placeholder="请输入商品名称"
        @change="handleSubmit"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="订单状态" prop="orderStatus">
      <el-select
        clearable
        v-model="params.orderStatus"
        placeholder="请选择订单状态"
        style="width: 180px"
        @change="handleSubmit"
      >
        <el-option
          v-for="item in orderStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="orderTime">
      <template #label>
        <el-select
          v-model="timeType"
          placeholder="请选择时间"
          style="width: 100px"
          @change="changeTimeType"
        >
          <el-option label="发货时间" :value="1"> </el-option>
          <el-option label="下单时间" :value="2"> </el-option>
        </el-select>
      </template>
      <el-date-picker
        v-if="timeType == 1"
        v-model="deliveryTime"
        type="daterange"
        value-format="YYYY-MM-DD"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeDeliveryTime"
      >
      </el-date-picker>
      <el-date-picker
        v-else-if="timeType == 2"
        v-model="orderTime"
        type="daterange"
        value-format="YYYY-MM-DD"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeOrderTime"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="sale-sum">
    <!-- <div class="sale-sum-item">
      <span class="tit">总销售额</span>
      <span class="con">￥ {{ formatMoney(count.transactionPrice) }}</span>
    </div> -->
    <div class="sale-sum-item">
      <span class="tit">未结算订单</span>
      <span class="con">{{ count.unsettledNum }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">已结算订单</span>
      <span class="con">{{ count.settledNum }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">未结算销售额</span>
      <span class="con">￥ {{ formatMoney(count.unsettledBidPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">已结算销售额</span>
      <span class="con">￥ {{ formatMoney(count.settledBidPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">未结算金额</span>
      <span class="con">￥ {{ formatMoney(count.unsettledPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">已结算金额</span>
      <span class="con">￥ {{ formatMoney(count.settledPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">未结算利润</span>
      <span class="con">￥ {{ formatMoney(count.unsettledProfitPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">已结算利润</span>
      <span class="con">￥ {{ formatMoney(count.settledProfitPrice) }}</span>
    </div>
    <div class="sale-sum-item">
      <span class="tit">销售毛利率(%) </span>
      <span class="con">{{ count.grossProfitRate }}</span>
    </div>
  </div>
  <!-- table工具条 -->
  <toolbar ref="toolBar" title="商品列表">
    <template #btns>
      <el-button type="danger" size="mini" @click="handleBetchDel"> 批量删除 </el-button>
    </template>
  </toolbar>
  <!-- 列表 -->
  <table-com
    class="table"
    :columns="tableColumn"
    :data="tableData"
    style="width: 100%"
    :max-height="ve_max_height"
    @selection-change="selectionChange"
  >
  </table-com>
  <!-- 分页 -->
  <el-pagination
    ref="pagination"
    background
    @size-change="(val) => handleSizeChange(val, params, getDataList)"
    @current-change="(val) => handleCurrentChange(val, params, getDataList)"
    :hide-on-single-page="total <= size ? true : false"
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[10, 20, 50, 100]"
    :current-page="params.page"
    :page-size="params.size"
    :total="params.total"
  >
  </el-pagination>
</template>
<script setup lang="jsx">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance //获取当前组件实例
} from 'vue'
import { useRoute } from 'vue-router'
import {
  onSubmit,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
  maxHeight
} from '@/views/layoutpages/common'
import { formatMoney } from '@/utils/index'
import { getMonthStartDate, getMonthEndDate } from '@/utils/date'

const { proxy } = getCurrentInstance()

const ve_max_height = ref(0)
const toolBar = ref(null)
const pagination = ref(null)
const queryForm = ref(null)
const tableData = ref([])
const timeType = ref(1)
const orderTime = ref([])
const deliveryTime = ref([])
const count = ref({})

const orderStatusList = ref([
  { label: '未结算', value: 1 },
  { label: '已结算', value: 2 },
  { label: '已退货', value: 3 }
])
const tableColumn = ref([
  {
    props: { type: 'selection', width: '55' }
  },
  {
    props: { prop: 'orderSn', label: '订单号', width: '200px' }
  },
  {
    props: { prop: 'orderType', label: '订单类型', width: '100px' }
  },
  {
    props: { prop: 'name', label: '商品信息', minWidth: '280px', showOverflowTooltip: true },
    default: (scope) => {
      return (
        <div class="goods-info">
          <div class="goods-img">
            <el-image src={scope.row.imgUrl} fit="fit"></el-image>
          </div>
          <div class="goods-name ellipsis-text">
            <p>
              货号：<strong>{scope.row.goodsSn}</strong>
            </p>
            <p>
              <strong>{scope.row.goodsName}</strong>{' '}
            </p>
            <p>
              {' '}
              尺码：<strong>{scope.row.sizeName}</strong>{' '}
            </p>
          </div>
        </div>
      )
    }
  },
  {
    props: { prop: 'bidPrice', label: '销售金额', width: '100px' },
    default: (scope) => {
      return formatMoney(scope.row.bidPrice)
    }
  },
  {
    props: { prop: 'transactionPrice', label: '交易金额', width: '100px' },
    default: (scope) => {
      return formatMoney(scope.row.transactionPrice)
    }
  },
  {
    props: { prop: 'incomePrice', label: '预计收入', width: '100px' },
    default: (scope) => {
      return formatMoney(scope.row.incomePrice)
    }
  },
  {
    props: { prop: 'receivedPrice', label: '实收金额', width: '100px' },
    default: (scope) => {
      return formatMoney(scope.row.receivedPrice)
    }
  },
  {
    props: { prop: 'costPrice', label: '成本', width: '100px' },
    default: (scope) => {
      return formatMoney(scope.row.costPrice)
    }
  },
  {
    props: { prop: 'profitprice', label: '预计利润', width: '100px' },
    default: (scope) => {
      return formatMoney(scope.row.profitprice)
    }
  },
  {
    props: { prop: 'actualProfitPrice', label: '实际利润', width: '100px' },
    default: (scope) => {
      return formatMoney(scope.row.actualProfitPrice)
    }
  },
  {
    props: { prop: 'orderTime', label: '下单时间', width: '180px' },
    default: (scope) => {
      return scope.row.orderTime ? new Date(scope.row.orderTime).Format('yyyy-MM-dd hh:mm:ss') : ''
    }
  },
  {
    props: { prop: 'deliveryTime', label: '发货时间', width: '180px' },
    default: (scope) => {
      return scope.row.deliveryTime
        ? new Date(scope.row.deliveryTime).Format('yyyy-MM-dd hh:mm:ss')
        : ''
    }
  },
  {
    props: { prop: 'settlementTime', label: '结算时间', width: '180px' },
    default: (scope) => {
      return scope.row.settlementTime
        ? new Date(scope.row.settlementTime).Format('yyyy-MM-dd hh:mm:ss')
        : ''
    }
  },
  {
    props: { prop: 'returnTime', label: '退货时间', width: '180px' },
    default: (scope) => {
      return scope.row.returnTime
        ? new Date(scope.row.returnTime).Format('yyyy-MM-dd hh:mm:ss')
        : ''
    }
  },
  {
    props: { prop: 'orderStatus', label: '订单状态', width: '100px' },
    default: (scope) => {
      if (scope.row.orderStatus == 1) {
        return <el-text type="warning">未结算</el-text>
      } else if (scope.row.orderStatus == 2) {
        return <el-text type="success">已结算</el-text>
      } else if (scope.row.orderStatus == 3) {
        return <el-text type="danger">已退货</el-text>
      } else if (scope.row.orderStatus == 4) {
        return <el-text type="danger">已关闭</el-text>
      }
    }
  },
  {
    props: {
      prop: 'action',
      label: '操作',
      fixed: 'right',
      width: '90px'
    },
    default: (scope) => {
      return (
        <>
          <el-button type="danger" size="mini" onClick={() => handleDel(scope.row.orderSn)}>
            删除
          </el-button>
        </>
      )
    }
  }
])
const selectedOrderList = ref([])
const selectionChange = (val) => {
  selectedOrderList.value = val.map((item) => item.orderSn)
}
/* 请求参数 */
const params = reactive({
  size: 10,
  page: 1,
  total: 0,
  goodsName: '',
  orderStatus: '',
  orderSn: '',
  orderStartTime: '',
  orderEndTime: '',
  deliveryStartTime: '',
  deliveryEndTime: ''
})
const route = useRoute()

onMounted(async () => {
  if (route.query.orderSn) {
    params.orderSn = route.query.orderSn
  } else {
    deliveryTime.value = [getMonthStartDate(), getMonthEndDate()]
    params.deliveryStartTime = deliveryTime.value[0]
    params.deliveryEndTime = deliveryTime.value[1]
  }

  await getDataList()
  await getOrderCount()
  maxHeight(pagination, queryForm, toolBar, ve_max_height)
})
/* 获取列表 */
const getDataList = async () => {
  const { code, data, total } = await VE_API.order.orderList(params)
  console.log(total)
  if (code == 200) {
    tableData.value = data
    params.total = total
  }
}
const changeOrderTime = () => {
  params.orderStartTime = orderTime.value?.[0] || ''
  params.orderEndTime = orderTime.value?.[1] || ''
  handleSubmit()
}
const changeDeliveryTime = () => {
  params.deliveryStartTime = deliveryTime.value?.[0] || ''
  params.deliveryEndTime = deliveryTime.value?.[1] || ''
  handleSubmit()
}

const changeTimeType = () => {
  orderTime.value = []
  params.orderStartTime = ''
  params.orderEndTime = ''
  deliveryTime.value = []
  params.deliveryStartTime = ''
  params.deliveryEndTime = ''
}
const handleSubmit = () => {
  onSubmit(params, getDataList)
  getOrderCount()
}
const handleReset = () => {
  params.orderStartTime = ''
  params.orderEndTime = ''
  orderTime.value = []
  params.deliveryStartTime = ''
  params.deliveryEndTime = ''
  deliveryTime.value = []
  resetForm(queryForm.value, params, getDataList)
  getOrderCount()
}
/**
 * @description
 * @param
 * @return
 */
const getOrderCount = async () => {
  const { code, data } = await VE_API.order.orderCount({
    goodsName: params.goodsName,
    orderSn: params.orderSn,
    orderStartTime: params.orderStartTime,
    orderEndTime: params.orderEndTime,
    deliveryStartTime: params.deliveryStartTime,
    deliveryEndTime: params.deliveryEndTime
  })
  if (code == 200) {
    count.value = data
  }
}
const handleBetchDel = () => {
  if (!selectedOrderList.value.length) {
    proxy.$message({
      type: 'error',
      message: '请选择订单'
    })
    return
  }
  handleDel(selectedOrderList.value.join())
}
const handleDel = (orderSn) => {
  proxy
    .$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
    .then(async () => {
      const { code } = await VE_API.order.orderDel({ orderSn })
      if (code == 200) {
        proxy.$message({
          type: 'success',
          message: '删除成功'
        })
        handleSubmit()
      }
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
}
</script>
<style scoped lang="scss">
.sale-sum {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  .sale-sum-item {
    width: 25%;
    padding: 5px 0;
    border: 1px solid #d7d7d7;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 33px;
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
