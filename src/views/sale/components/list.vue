<template>
  <el-tabs v-model="status" type="border-card">
    <el-tab-pane label="已销售" :name="1">
      <!-- 搜索 -->
      <el-form ref="queryForm" :inline="true" :model="params">
        <el-form-item label="日期" prop="createTime">
          <el-date-picker
            v-model="createTime"
            type="daterange"
            value-format="YYYY-MM-DD"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            @change="onSubmit(params, getDataList)"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(params, getDataList)">搜索</el-button>
          <el-button @click="resetForm(queryForm, params, getDataList)">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表 -->
      <table-com :columns="tableColumn" :data="tableData" @row-click="rowClick"> </table-com>
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
    </el-tab-pane>
    <el-tab-pane label="已撤销" :name="2">
      <!-- 搜索 -->
      <el-form ref="queryForm" :inline="true" :model="params">
        <el-form-item label="日期" prop="createTime">
          <el-date-picker
            v-model="createTime"
            type="daterange"
            value-format="YYYY-MM-DD"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            @change="onSubmit(params, getDataList)"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(params, getDataList)">搜索</el-button>
          <el-button @click="resetForm(queryForm, params, getDataList)">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表 -->
      <table-com :columns="tableColumn" :data="tableData" @row-click="rowClick"> </table-com>
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
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { useStore } from 'vuex'
import { ref, reactive, onMounted, toRefs, watch } from 'vue'
import {
  onSubmit,
  resetForm,
  handleSizeChange,
  handleCurrentChange
} from '@/views/layoutpages/common'
export default {
  setup(props, { emit }) {
    const store = useStore()
    const queryForm = ref(null)
    const tableData = ref([])
    const shortcuts = ref([
      {
        text: '最近一周',
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        })()
      },
      {
        text: '最近一个月',
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        })()
      },
      {
        text: '最近三个月',
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        })()
      }
    ])
    const params = reactive({
      createTime: [],
      createTimeBegin: '', //开始时间
      createTimeEnd: '', //结束时间
      status: 1, //1采购  2撤销
      itemType: 1,
      size: 10,
      page: 1,
      total: 0
    })
    const tableColumn = ref([
      {
        props: { prop: 'createTime', label: '日期' },
        default: (scope) => {
          return new Date(scope.row.createTime).Format('yyyy-MM-dd hh:mm:ss')
        }
      }
    ])

    const { createTime, createTimeBegin, createTimeEnd, status, page, size, total } = toRefs(params)

    watch(status, async () => {
      await getDataList()
    })

    /**
     * @description 获取采购列表
     * @param
     * @return
     */
    const getDataList = async () => {
      const { code, data, total } = await VE_API.sale.saleList({
        createTimeBegin: params.createTime.length ? params.createTime[0] + ' 00:00:00' : '',
        createTimeEnd: params.createTime.length ? params.createTime[1] + ' 23:59:59' : '',
        status: params.status,
        itemType: params.itemType,
        size: params.size,
        page: params.page
      })
      if (code == 200) {
        tableData.value = data
        params.total = total
      }
    }

    /**
     * @description 点击一行 查看详情
     * @param
     * @return
     */

    const rowClick = ({ saleSn }, column, event) => {
      emit('changeOrderSn', saleSn)
    }
    onMounted(async () => {
      await getDataList()
    })
    return {
      onSubmit,
      resetForm,
      queryForm,
      params,
      status,
      size,
      page,
      total,
      createTime,
      createTimeBegin,
      createTimeEnd,
      tableColumn,
      tableData,
      handleSizeChange,
      handleCurrentChange,
      getDataList,
      shortcuts,
      rowClick
    }
  }
}
</script>
