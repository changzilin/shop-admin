<template>
  <el-dialog v-model="dialogVisible" align-center destroy-on-close title="商品选择" width="80%">
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" height="60vh" v-loading="loading"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex">
            <el-image :src="row.cover" class="mr-3 rounded" :preview-src-list="[row.cover]" :initial-index="0"
              preview-teleported fit="cover" style="width: 90px;height:80px;"></el-image>
            <div class="flex-1">
              <p>{{ row.title }}</p>
              <div>
                <span class="text-rose-500">￥{{ row.min_price }}</span>
                <el-divider direction="vertical" />
                <span class="text-gray-500 text-xs">{{ row.min_oprice }}</span>
              </div>
              <p class="text-gray-400 text-xs mb-1">分类:{{ row.category ? row.category.name : "未分类" }}</p>
              <p class="text-gray-400 text-xs mb-1">创建时间:{{ row.create_time }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="总库存" width="100" align="center"></el-table-column>
      <el-table-column label="价格（元）" align="center">
        <template #default="{ row }">
          <span class="text-rose-500">￥{{ row.min_price }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex justify-center items-center mt-5">
      <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue"
import { getGoodsList } from "@/api/goods.js"
import { useInitTable } from "@/hooks/useTable.js"
import { notification } from "@/utils/common.js"

// 列表 | 分页 | 多选 | 批量删除
const optionTable = {
  searchForm: {
    title: null,
    tab: "all",
    category_id: null
  },
  getList: getGoodsList,
  onGetListSuccess: handleSuccess
}
const { searchForm, tableData, loading, currentPage, total, limit, getData,
  handleSelectionChange, multiSelectionIds
} = useInitTable(optionTable)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.list
  total.value = res.totalCount
}

// 显示 | 隐藏
const dialogVisible = ref(false)

// 打开
const callbackFun = ref(null)
function open(callback = null) {
  callbackFun.value = callback
  dialogVisible.value = true
}

// 提交
function submit() {
  if (multiSelectionIds.value.length == 0) return notification("请先选择商品", "error")
  if (typeof callbackFun.value == "function") {
    callbackFun.value(multiSelectionIds.value)
  }
  dialogVisible.value = false
}

defineExpose({ open })
</script>