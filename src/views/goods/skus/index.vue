<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 | 删除 | 刷新 -->
    <ListHeader layout="add,delete,refresh" @add="handleCreate" @refresh="getData" @delete="handleMultiDelete">
    </ListHeader>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="规格名称" show-overflow-tooltip />
      <el-table-column prop="default" label="规格值" show-overflow-tooltip width="380" />
      <el-table-column prop="order" label="排序" />
      <el-table-column label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-switch :modelValue="row.status" :loading="row.loading" :disabled="row.super == 1" :active-value="1"
            :inactive-value="0" @change="handleChangeStatus($event, row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否要删除该规格？" width="171" confirm-button-text="删除" cancel-button-text="取消"
            @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex justify-center items-center mt-5">
      <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
    <!-- 新增 -->
    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入规格名称" />
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <TagInput v-model="form.default"></TagInput>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import ListHeader from "@/components/table/ListHeader.vue"
import TagInput from "@/components/TagInput.vue"
import { getSkusList, updateSkus, addSkus, updateSkusStatus, deleteSkus } from "@/api/goods.js"
import { useInitTable, useInitForm, useDeleteAndChange } from "@/hooks/useTable.js"

// 列表 | 分页 | 多选 | 批量删除
const optionTable = { getList: getSkusList, delete: deleteSkus }
const { tableData, loading, currentPage, total, limit, getData, handleSelectionChange, handleMultiDelete } = useInitTable(optionTable)

// 新增 | 修改
const optionForm = {
  form: {
    name: "",
    default: "",
    order: 50,
    status: 1
  },
  rules: {
    name: [{ required: true, message: '规格名称不能为空', trigger: 'blur' }],
    default: [{ required: true, message: '规格值不能为空', trigger: 'blur' }]
  },
  getData,
  update: updateSkus,
  add: addSkus
}
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm(optionForm)

// 删除 | 修改状态
const option = { loading, getData, delete: deleteSkus, updateStatus: updateSkusStatus }
const { handleDelete, handleChangeStatus } = useDeleteAndChange(option)

</script>
