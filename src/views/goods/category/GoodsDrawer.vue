<template>
  <FormDrawer ref="formDrawerRef" title="推荐商品" size="60%" confirmText="关联" @submit="handleConnect">
    <el-table :data="tableData" border style="width: 98%">
      <el-table-column prop="goods_id" label="ID" width="60" align="center" />
      <el-table-column label="商品封面" width="160" align="center">
        <template #default="{ row, $index }">
          <el-image :src="row.cover" fit="cover" :preview-src-list="tableData.map(item => item.cover)"
            :initial-index="$index" preview-teleported hide-on-click-modal style="width: 74px;height: 64px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" align="center" />
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ row }">
          <el-popconfirm title="是否删除该分类？" width="171" confirm-button-text="删除" cancel-button-text="取消"
            @confirm="handleDelete(row)">
            <template #reference>
              <el-button :loading="row.loading" type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </FormDrawer>
  <!-- 选择商品 -->
  <ChooseGoods ref="chooseGoodsRef"></ChooseGoods>
</template>

<script setup>
import { ref } from "vue"
import ChooseGoods from "@/components/goods/ChooseGoods.vue"
import { notification } from "@/utils/common.js"
import { getCategoryGoods, deleteCategoryGoods, connectCategoryGoods } from "@/api/category.js"

const formDrawerRef = ref(null)
const categoryId = ref(0)
const tableData = ref([])

// 获取数据
async function getData() {
  try {
    let res = await getCategoryGoods(categoryId.value)
    tableData.value = res.map(item => {
      item.loading = false
      return item
    })
    return res
  } catch (error) { }
}

// 打开
async function open(data) {
  categoryId.value = data.id
  data.goodsDrawerloading = true
  try {
    await getData()
    formDrawerRef.value.open()
  } finally {
    data.goodsDrawerloading = false
  }
}

// 删除关联产品
async function handleDelete(row) {
  row.loading = true
  try {
    await deleteCategoryGoods(row.id)
    notification("删除关联产品成功")
    getData()
  } finally {
    row.loading = false
  }
}

// 选择商品
const chooseGoodsRef = ref(null)

// 提交
function handleConnect() {
  chooseGoodsRef.value.open(async goodsIds => {
    // 关联商品
    formDrawerRef.value.showLoading()
    try {
      await connectCategoryGoods({
        category_id: categoryId.value,
        goods_ids: goodsIds
      })
      notification("关联成功")
      getData()
    } finally {
      formDrawerRef.value.hideLoading()
    }
  })
}

// 暴露方法
defineExpose({ open })
</script>