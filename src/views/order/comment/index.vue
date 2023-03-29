<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <SearchItem label="关键词">
        <el-input v-model="searchForm.title" placeholder="商品标题" clearable />
      </SearchItem>
    </Search>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" default-expand-all v-loading="loading">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-17.5 pr-1">
            <el-avatar :src="row.user.avatar" :size="50" fit="cover" class="mr-3" />
            <div class="flex-1">
              <!-- 用户信息 -->
              <h6 class="flex items-center">
                {{ row.user.nickname || row.user.username }}
                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                <el-button v-if="!row.textareaEdit && !row.extra" size="small" class="ml-auto"
                  @click="openTextarea(row)">回复</el-button>
              </h6>
              {{ row.review.data }}
              <!-- 回复图片 -->
              <div class="py-2">
                <el-image v-for="(item, index) in row.review.image" :key="index" :src="item"
                  :preview-src-list="row.review.image" :initial-index="index" fit="cover"
                  style="width: 100px;height: 100px;" class="rounded" preview-teleported hide-on-click-modal></el-image>
              </div>
              <Transition name="comment" mode="out-in">
                <!-- 回复输入框 -->
                <div v-if="row.textareaEdit">
                  <el-input v-model="textarea" type="textarea" :rows="2" placeholder="请输入回复内容"></el-input>
                  <div class="py-2">
                    <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                    <el-button size="small" class="ml-2" @click="row.textareaEdit = false">取消</el-button>
                  </div>
                </div>
                <!-- 客服回复 -->
                <div v-else>
                  <div v-for="(item, index) in row.extra" :key="index" class="mt-3 p-3 bg-gray-100 rounded">
                    <h6 class="flex font-bold">
                      客服
                      <el-button type="info" size="small" class="ml-auto" @click="openTextarea(row, item.data)">修改
                      </el-button>
                    </h6>
                    <p>{{ item.data }}</p>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="70" align="center"></el-table-column>
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image :src="row.goods_item ? row.goods_item.cover : ''" :preview-src-list="[row.goods_item.cover]"
              :initial-index="0" fit="cover" style="width: 50px;height: 50px;" class="rounded" preview-teleported
              hide-on-click-modal>
            </el-image>
            <div class="ml-3">
              <h6>{{ row.goods_item?.title ?? "商品已被删除" }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" width="200">
        <template #default="{ row }">
          <div>
            <p>用户: {{ row.user.nickname || row.user.username }}</p>
            <p><el-rate v-model="row.rating" disabled text-color="#ff9900" /></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="review_time" label="评价时间" width="180" align="center"></el-table-column>
      <el-table-column label="状态" width="150" align="center">
        <template #default="{ row }">
          <el-switch :modelValue="row.status" :loading="row.loading" :disabled="row.super == 1" :active-value="1"
            :inactive-value="0" @change="handleChangeStatus($event, row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex justify-center items-center mt-5">
      <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
  </el-card>
</template>

<script setup>
import { ref } from "vue"
import Search from "@/components/search/Search.vue"
import SearchItem from "@/components/search/SearchItem.vue"
import { notification } from "@/utils/common.js"
import { getGoodsCommentList, updateGoodsCommentStatus, reviewGoodsComment } from "@/api/order.js"
import { useInitTable, useDeleteAndChange } from "@/hooks/useTable.js"

// 所属角色
const roles = ref([])

// 列表 | 分页 | 搜索
const optionTable = {
  searchForm: { title: null },
  getList: getGoodsCommentList,
  onGetListSuccess: handleSuccess
}
const { searchForm, resetSearchForm, tableData, loading, currentPage, total, limit, getData } = useInitTable(optionTable)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.list.map(item => {
    item.loading = false
    item.textareaEdit = false
    return item
  })
  total.value = res.totalCount
  roles.value = res.roles
}

// 删除 | 修改状态
const option = { loading, getData, updateStatus: updateGoodsCommentStatus }
const { handleChangeStatus } = useDeleteAndChange(option)

// 回复
const textarea = ref("")
// 打开回复框
function openTextarea(row, data = "") {
  textarea.value = data
  row.textareaEdit = true
}

// 回复评价
async function review(row) {
  if (textarea.value == "") return notification("回复内容不能为空", "error")
  try {
    await reviewGoodsComment(row.id, textarea.value)
    row.textareaEdit = false
    notification("回复成功")
    getData()
  } catch (error) {
  }
}

</script>

<style scoped>
@keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -10%, 0);
    transform: translate3d(0, -10%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 10%, 0);
    transform: translate3d(0, 10%, 0);
  }
}

.comment-enter-active {
  animation: fadeInDown 0.3s;
}

.comment-leave-active {
  animation: fadeOutDown 0.3s;
}
</style>
