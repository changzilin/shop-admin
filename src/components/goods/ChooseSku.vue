<template>
  <el-dialog v-model="dialogVisible" title="规格选择" width="80%" top="5vh">
    <!-- 内容 -->
    <el-container v-loading="loading" style="height: 65vh;">
      <el-aside class="sku-aside" width="220px">
        <div class="top">
          <div v-for="item in tableData" :key="item.id" :class="{ 'active': activeId == item.id }" class="sku-list"
            @click="handleChangeActiveId(item.id)">
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit"
            @current-change="getData" />
        </div>
      </el-aside>
      <el-main>
        <el-checkbox-group v-model="form.list">
          <el-checkbox v-for="(item, index) in list" :key="index" :label="item" border>{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>
    <!-- 底部 -->
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue"
import { getSkusList } from "@/api/goods.js"
import { useInitTable } from "@/hooks/useTable.js"

const option = { getList: getSkusList, onGetListSuccess: handleSuccess }
const { tableData, loading, currentPage, total, limit, getData } = useInitTable(option)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.list
  total.value = res.totalCount
  // 默认选中第一个
  if (tableData.value.length > 0) {
    handleChangeActiveId(tableData.value[0].id)
  }
}

const dialogVisible = ref(false)
const activeId = ref(0)
// 打开
const callbackFunction = ref(null)
function open(callback = null) {
  callbackFunction.value = callback
  getData(1)
  dialogVisible.value = true
}

const list = ref([])
const form = reactive({
  name: "",
  list: []
})
// 切换id
function handleChangeActiveId(id) {
  activeId.value = id
  list.value = []
  let item = tableData.value.find(item => item.id == id)
  if (item) {
    list.value = item.default.split(",")
    form.name = item.name
  }
}

// 提交
function submit() {
  if (typeof callbackFunction.value == "function") {
    callbackFunction.value(form)
  }
  form.list = []
  dialogVisible.value = false
}

defineExpose({ open })
</script>

<style scoped>
.sku-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}

.sku-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.sku-aside .bottom {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  height: 50px;
  @apply flex items-center justify-center;
}

.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply flex items-center p-3 text-sm text-gray-600 cursor-pointer;
}

.sku-list:hover,
.active {
  @apply bg-blue-50;
}
</style>