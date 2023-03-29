<template>
  <el-drawer v-model="drawerVisible" :title="drawerTitle" size="70%">
    <!-- 搜索 -->
    <el-form :model="searchForm" label-width="68px">
      <el-form-item label="时间选择">
        <el-radio-group v-model="searchForm.type">
          <el-radio-button label="all" size="small">全部</el-radio-button>
          <el-radio-button label="today" size="small">今天</el-radio-button>
          <el-radio-button label="yesterday" size="small">昨天</el-radio-button>
          <el-radio-button label="last7days" size="small">最近7天</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="searchForm.starttime" value-format="YYYY-MM-DD" type="date" placeholder="开始日期" />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="searchForm.endtime" value-format="YYYY-MM-DD" type="date" placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="searchForm.level">
          <el-radio-button :label="0" size="small">全部</el-radio-button>
          <el-radio-button :label="1" size="small">一级推广</el-radio-button>
          <el-radio-button :label="2" size="small">二级推广</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="getData">搜索</el-button>
        <el-button size="small" type="primary" @click="resetSearchForm">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%;">
      <!-- 推广人 -->
      <template v-if="type == 'user'">
        <el-table-column label="ID" prop="id" align="center" />
        <el-table-column label="图像" min-width="65">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" prop="username" min-width="100" align="center" />
        <el-table-column label="推广数" prop="share_num" min-width="90" align="center" />
        <el-table-column label="推广订单数" prop="share_order_num" min-width="96" align="center" />
        <el-table-column label="绑定时间" prop="create_time" min-width="170" align="center" />
      </template>
      <!-- 推广订单 -->
      <template v-else>
        <el-table-column label="订单号" min-width="65">
          <template #default="{ row }">{{ row.order.no }}</template>
        </el-table-column>
        <el-table-column label="用户名|昵称|手机号" min-width="65">
          <template #default="{ row }">
            <div v-if="!row.order.user">该用户已被删除</div>
            <div v-else>
              {{ row.order.user.username }}|{{ row.order.user.nickname }}|{{ row.order.user.phone }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="create_time" min-width="65" />
        <el-table-column label="返佣金额" prop="commission" min-width="65" />
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="flex justify-center items-center mt-5">
      <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed } from "vue"
import { getAgentList, getAgentOrderList } from "@/api/distribution.js"
import { useInitTable } from "@/hooks/useTable.js"

const props = defineProps({
  type: {
    type: String,
    default: "user"
  }
})

// 列表 | 分页 | 搜索
const optionTable = {
  searchForm: {
    type: "all",
    starttime: null,
    endtime: null,
    level: 0,
    user_id: 0
  },
  getList: (() => props.type == "user" ? getAgentList : getAgentOrderList)(),
  onGetListSuccess: handleSuccess
}
const { searchForm, tableData, loading, currentPage, total, limit, getData } = useInitTable(optionTable)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.list
  total.value = res.totalCount
}
// 重置搜索表单 | user_id不能重置
function resetSearchForm() {
  searchForm.type = "all"
  searchForm.starttime = null
  searchForm.endtime = null
  searchForm.level = 0
  getData()
}

// 显示 | 隐藏
const drawerVisible = ref(false)
// 标题
const drawerTitle = computed(() => props.type == "user" ? "推广人列表" : "推广订单列表")

// 打开
function open(id) {
  drawerVisible.value = true
  searchForm.user_id = id
  getData()
}


defineExpose({ open })
</script>