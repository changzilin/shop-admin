<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 | 刷新 -->
    <ListHeader @add="handleCreate" @refresh="getData"></ListHeader>
    <!-- 树形菜单 -->
    <el-tree v-loading="loading" :data="tableData" :props="{ label: 'name', children: 'child' }" node-key="id">
      <template #default="{ data }">
        <div class="tree-node">
          <span>{{ data.name }}</span>
          <!-- 右侧 -->
          <div class="ml-auto">
            <el-button text type="primary" size="small" :loading="data.goodsDrawerloading"
              @click="openGoodsDrawer(data)">推荐商品</el-button>
            <el-switch :modelValue="data.status" :loading="data.loading" :active-value="1" :inactive-value="0"
              @change="handleChangeStatus($event, data)" @click.stop>
            </el-switch>
            <el-button text type="primary" size="small" v-if="data.menu">增加</el-button>
            <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
            <el-popconfirm title="是否删除该分类？" width="171" confirm-button-text="删除" cancel-button-text="取消"
              @confirm="handleDelete(data.id)">
              <template #reference>
                <el-button text type="primary" size="small" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <!-- 新增 -->
    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" style="width:98%;">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" :input-style="{ width: '98%' }" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
    </FormDrawer>
    <!-- 推荐商品 -->
    <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
  </el-card>
</template>

<script setup>
import { ref } from "vue"
import ListHeader from "@/components/table/ListHeader.vue"
import GoodsDrawer from "./GoodsDrawer.vue"
import { getCategoryList, updateCategory, addCategory, updateCategoryStatus, deleteCategory } from "@/api/category.js"
import { useInitTable, useInitForm, useDeleteAndChange } from "@/hooks/useTable.js"


// 列表 
const optionTable = { getList: getCategoryList, onGetListSuccess: handleSuccess }
const { loading, tableData, getData } = useInitTable(optionTable)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.map(item => {
    item.goodsDrawerloading = false
    return item
  })
}

// 新增 | 修改
const optionForm = {
  form: {
    name: ""
  },
  rules: { name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }] },
  getData,
  update: updateCategory,
  add: addCategory
}
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm(optionForm)

// 删除 | 修改状态
const option = { loading, getData, delete: deleteCategory, updateStatus: updateCategoryStatus }
const { handleDelete, handleChangeStatus } = useDeleteAndChange(option)

// 打开推荐商品
const goodsDrawerRef = ref(null)
const openGoodsDrawer = data => goodsDrawerRef.value.open(data)

</script>

<style scoped>
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}

:deep(.el-tree-node__content) {
  height: auto;
  padding: 4px 0;
}
</style>