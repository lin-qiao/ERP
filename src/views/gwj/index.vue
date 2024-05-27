<template>
  <!-- 列表 -->
  <el-table :data="tableData">
    <el-table-column prop="cookie" label="cookie" align="center" min-width="200">
      <template v-slot="{ row, $index }">
        <el-input v-model="row.cookie" :rows="2" type="textarea" placeholder="输入cookie" />
      </template>
    </el-table-column>
    <el-table-column prop="itemId" label="itemId" align="center" min-width="200">
      <template v-slot="{ row, $index }">
        <el-input v-model="row.itemId" :rows="2" placeholder="输入itemId" />
      </template>
    </el-table-column>
    <el-table-column prop="skuId" label="skuId" align="center" min-width="200">
      <template v-slot="{ row, $index }">
        <el-input v-model="row.skuId" :rows="2" placeholder="输入skuId" />
      </template>
    </el-table-column>
    <el-table-column prop="time" label="time" align="center" min-width="200">
      <template v-slot="{ row, $index }">
        <el-input v-model="row.time" :rows="2" placeholder="输入time" />
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100" align="center">
      <template v-slot="{ row, $index }">
        <div class="btn">
          <el-button type="primary" @click="testSend(row)">测试发送</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="primary">添加</el-button>
</template>
<script setup>
import { ref, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { sign, initTime, getCookie } from '@/utils'
import axios from 'axios'
const tableData = ref([
  {
    cookie: '',
    itemId: '',
    skuId: '',
    time: initTime()
  }
])

const testSend = row => {
  console.log(row)
  const token = getCookie(row.cookie, '_m_h5_tk').split('_')[0]
  const date = new Date().getTime()

  const signs = sign(token, date, '12574478', {
    itemId: row.itemId,
    skuId: row.skuId,
    isGift: false,
    channel: 'newdetail'
  })
  axios.get(
    `/h5/mtop.alibaba.mktview.trade.expandcard.createorder/1.0/?jsv=2.6.1&appKey=12574478&t=1698838986066&sign=${signs}&api=mtop.alibaba.mktview.trade.expandcard.createOrder&v=1.0&dataType=jsonp&preventFallback=true&type=jsonp&callback=mtopjsonp7&data=%7B%22itemId%22%3A%22${row.itemId}%22%2C%22skuId%22%3A%22${row.skuId}%22%2C%22isGift%22%3Afalse%2C%22channel%22%3A%22newdetail%22%7D`,
    {
      headers: {
        cookie: row.cookie
      }
    }
  )
}
</script>
