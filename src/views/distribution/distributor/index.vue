<template>
  <div>
    <Panel></Panel>
    <el-card shadow="never" class="border-0">
      <!-- 搜索 -->
      <Search :model="searchForm" class="search" @search="getData" @reset="resetSearchForm">
        <SearchItem label="时间选择">
          <!-- all全部，today今天，yesterday昨天，last7days最近7天 -->
          <el-radio-group v-model="searchForm.type">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="today">今天</el-radio-button>
            <el-radio-button label="yesterday">昨天</el-radio-button>
            <el-radio-button label="last7days">最近7天</el-radio-button>
          </el-radio-group>
        </SearchItem>
        <template #expand>
          <SearchItem label="开始时间">
            <el-date-picker v-model="searchForm.starttime" value-format="YYYY-MM-DD" type="date" placeholder="开始日期" />
          </SearchItem>
          <SearchItem label="结束时间">
            <el-date-picker v-model="searchForm.endtime" value-format="YYYY-MM-DD" type="date" placeholder="结束日期" />
          </SearchItem>
          <SearchItem label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="关键词" clearable />
          </SearchItem>
        </template>
      </Search>
      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column label="图像" width="65">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" width="150">
          <template #default="{ row }">
            <div class="text-xs">
              <p>用户：{{ row.username }}</p>
              <p>昵称：{{ row.nickname }}</p>
              <p>姓名：{{ row.user_info.name }}</p>
              <p>电话：{{ row.phone }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推广用户数量" prop="share_num" width="130" align="center" />
        <el-table-column label="订单数量" prop="share_order_num" align="center" />
        <el-table-column label="订单金额" prop="order_price" align="center" />
        <el-table-column label="账户佣金" prop="commission" align="center" />
        <el-table-column label="已提现金额" prop="cash_out_price" width="100" align="center" />
        <el-table-column label="提现次数" prop="cash_out_time" align="center" />
        <el-table-column label="未体现金额" prop="no_cash_out_price" width="100" align="center" />
        <el-table-column label="操作" fixed="right" width="180" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="openDataDrawer(row.id, 'user')">推广人</el-button>
            <el-button size="small" type="primary" @click="openDataDrawer(row.id, 'order')">推广订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="flex justify-center items-center mt-5">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="searchForm.limit"
          :page-sizes="[10, 20, 30, 40]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="getData" />
      </div>
    </el-card>
    <!-- 推广人详情 -->
    <DataDrawer ref="dataDrawerRef"></DataDrawer>
    <DataDrawer ref="orderDataDrawerRef" type="order"></DataDrawer>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Panel from "./Panel.vue"
import DataDrawer from "./DataDrawer.vue"
import Search from "@/components/search/Search.vue"
import SearchItem from "@/components/search/SearchItem.vue"
import { getAgentList } from "@/api/distribution.js"
import { useInitTable } from "@/hooks/useTable.js"

// 列表 | 分页 | 搜索
const optionTable = {
  searchForm: {
    keyword: null,
    type: "all",
    starttime: null,
    endtime: null,
    limit: 10
  },
  getList: getAgentList,
  onGetListSuccess: handleSuccess
}
const { searchForm, resetSearchForm, tableData, loading, currentPage, total,
  handleSizeChange, getData
} = useInitTable(optionTable)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.list
  total.value = res.totalCount
}

// 推广人 | 推广订单
const dataDrawerRef = ref(null)
const orderDataDrawerRef = ref(null)
function openDataDrawer(id, type) {
  (type == "user" ? dataDrawerRef : orderDataDrawerRef).value.open(id)
}

</script>

<style scoped>
.search :deep(.el-input) {
  flex: 1;
}
</style>