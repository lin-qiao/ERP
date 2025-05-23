<template>
  <!-- 搜索 -->
  <el-form ref="queryForm" :inline="true" :model="params">
    <el-form-item label="商品" prop="name">
      <el-input clearable v-model="name" placeholder="请输入商品名称"> </el-input>
    </el-form-item>
    <el-form-item label="品牌" prop="brandId">
      <el-select
        clearable
        v-model="brandId"
        style="width: 180px"
        placeholder="请选择商品品牌"
        @change="handleSubmit"
      >
        <el-option
          v-for="item in brandList"
          :key="item.id"
          :label="item.brand_name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
  <div ref="other" style="padding-bottom: 10px">
    <ul class="search-list">
      <li
        v-for="item in dateList"
        :class="item.value == type ? 'on' : ''"
        @click="handleChangeType(item.value)"
      >
        {{ item.label }}
      </li>
    </ul>
    <div class="sale-sum">
      <div class="sale-sum-item">
        <span class="tit">采购单品数</span>
        <span class="con">{{ count.numberTotal }}</span>
      </div>
      <div class="sale-sum-item">
        <span class="tit">采购总成本</span>
        <span class="con">￥ {{ formatMoney(count.costTotal) }}</span>
      </div>
    </div>
  </div>
  <!-- 列表 -->
  <table-com
    class="table"
    :columns="tableColumn"
    :data="tableData"
    style="width: 100%"
    :max-height="ve_max_height"
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
    :current-page="page"
    :page-size="size"
    :total="total"
  >
  </el-pagination>
</template>

<script lang="jsx">
import {
  ref,
  reactive,
  onMounted,
  toRefs,
  getCurrentInstance //获取当前组件实例
} from 'vue'
import { useRouter } from 'vue-router'
//*导入公共查询方法
import {
  onSubmit,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
  maxHeight
} from '@/views/layoutpages/common'
import { formatMoney } from '@/utils/index'
export default {
  setup() {
    const router = useRouter()
    const ve_max_height = ref(0)
    const pagination = ref(null)
    const queryForm = ref(null)
    const toolBar = ref(null)
    const other = ref(null)

    const dateList = ref([
      {
        value: 'thisMonth',
        label: '本月'
      },
      {
        value: 'lastMonth',
        label: '上月'
      },
      {
        value: 'thisYear',
        label: '本年'
      },
      {
        value: 'all',
        label: '全部'
      }
    ])
    const tableColumn = ref([
      {
        props: { prop: 'name', label: '商品信息', minWidth: '280px', showOverflowTooltip: true },
        default: (scope) => {
          return (
            <div class="goods-info">
              <div class="goods-img">
                <el-image src={scope.row.imgUrl} fit="fit"></el-image>
              </div>
              <div class="goods-name ellipsis-text">
                <p class="p1">
                  货号：<strong>{scope.row.goodsSn}</strong>
                </p>
                <p class="p2 ellipsis-text"> {scope.row.goodsName} </p>
              </div>
            </div>
          )
        }
      },
      {
        props: { prop: 'sizeName', label: '尺码', width: '80px' },
        default: ({ row }) => {
          return row.sizeName
        }
      },
      {
        props: { prop: 'totalNumber', label: '业务类型', width: '120px' },
        default: ({ row }) => {
          let text
          switch (row.flowType) {
            case 1:
              text = '采购单'
              break
            case 2:
              text = '采购退货单'
              break
            case 3:
              text = '销售单'
              break
            case 4:
              text = '销售退货单'
              break
          }
          return text
        }
      },
      {
        props: { prop: 'businessSn', label: '业务单号', width: '180px' },
        default: ({ row }) => {
          return (
            <el-link type="primary" href="javascript:;" onClick={() => toBusiness(row.businessSn)}>
              {row.businessSn}
            </el-link>
          )
        }
      },
      {
        props: { prop: 'number', label: '单品数量', width: '110px' }
      },
      {
        props: { prop: 'businessPrice', label: '单价', width: '100px' },
        default: (scope) => {
          return formatMoney(scope.row.businessPrice)
        }
      },
      {
        props: { prop: 'totalBusinessPrice', label: '总价', width: '120px' },
        default: (scope) => {
          return formatMoney(scope.row.totalBusinessPrice)
        }
      },
      {
        props: { prop: 'createTime', label: '时间', minWidth: '160px' },
        default: ({ row }) => {
          return new Date(row.createTime).Format('yyyy-MM-dd hh:mm:ss')
        }
      }
    ])
    /* 请求参数 */
    const params = reactive({
      size: 10,
      page: 1,
      total: 0,
      type: 'thisMonth',
      name: '',
      brandId: ''
    })
    const tableData = ref([])
    const brandList = ref([])

    let { size, page, total, type, name, brandId } = toRefs(params)

    const count = ref({})
    onMounted(async () => {
      await getBrandList()
      await getDataList()
      await getPurchaseCount()
      maxHeight(pagination, queryForm, toolBar, ve_max_height, other)
    })

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

    const handleSubmit = () => {
      onSubmit(params, getDataList)
      getPurchaseCount()
    }

    const handleReset = () => {
      resetForm(queryForm.value, params, getDataList)
      getPurchaseCount()
    }

    /* 获取列表 */
    const getDataList = async () => {
      const { code, data, total } = await VE_API.businessFlow.purchaseStatList(params)
      if (code == 200) {
        tableData.value = data
        params.total = total
      }
    }

    /**
     * @description  跳转订单
     * @param
     * @return
     */
    const getPurchaseCount = async () => {
      const { code, data } = await VE_API.businessFlow.purchaseCount({
        type: type.value,
        name: name.value,
        brandId: brandId.value
      })
      if (code == 200) {
        count.value = data
      }
    }
    /**
     * @description  跳转订单
     * @param
     * @return
     */
    const toBusiness = (orderSn) => {
      let url
      if (orderSn.indexOf('JH') != -1) {
        url = '/purchase?orderSn=' + orderSn
      } else if (orderSn.indexOf('JT') != -1) {
        url = '/purchaseReturn?orderSn=' + orderSn
      }
      window.open(url)
      // router.push(url)
    }
    /**
     * @description  改变type
     * @param
     * @return
     */
    const handleChangeType = async (value) => {
      params.type = value
      await getDataList()
      await getPurchaseCount()
    }

    return {
      params,
      total,
      page,
      size,
      type,
      queryForm,
      pagination,
      toolBar,
      tableColumn,
      tableData,
      ve_max_height,
      getDataList,
      handleSizeChange,
      handleCurrentChange,
      count,
      formatMoney,
      dateList,
      handleChangeType,
      brandList,
      name,
      brandId,
      onSubmit,
      resetForm,
      getPurchaseCount,
      handleSubmit,
      handleReset,
      other
    }
  }
}
</script>
<style lang="scss" scoped>
.search-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    font-style: none;
    line-height: 30px;
    font-size: 15px;
    cursor: pointer;
    padding: 10px;
    color: #222;

    &.on {
      color: $base_color;
    }
  }
}

.sale-sum {
  display: flex;
  align-items: center;
  justify-content: center;

  .sale-sum-item {
    width: 50%;
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

.table {
  &:deep(.goods-info) {
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

  &:deep(.stock-info) {
    width: 100%;
    display: flex;

    .stock-item {
      width: 33.33%;
    }

    span {
      line-height: 40px;
      display: inline-block;
    }

    .s1 {
      width: 90px;
      color: #99a9bf;
    }
  }
}
</style>
