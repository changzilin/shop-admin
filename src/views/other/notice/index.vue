<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 -->
    <ListHeader @add="handleCreate" @refresh="getData"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="创建时间" min-width="300" align="center" />
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否要删除该公告？" width="171" confirm-button-text="删除" cancel-button-text="取消"
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
    <!-- 新增|修改 -->
    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" style="width: 98%;">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入公告内容" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import ListHeader from "@/components/table/ListHeader.vue"
import { getNoticeList, addNotice, updateNotice, deleteNotice } from "@/api/notice.js"
import { useInitTable, useInitForm, useDeleteAndChange } from "@/hooks/useTable.js"

// 列表 | 分页 
const optionTable = { getList: getNoticeList }
const { tableData, loading, currentPage, total, limit, getData } = useInitTable(optionTable)

// 新增 | 修改
const optionForm = {
  form: {
    title: "",
    content: ""
  },
  rules: {
    title: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
    content: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }]
  },
  getData,
  update: updateNotice,
  add: addNotice
}
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm(optionForm)

// 删除
const option = { loading, getData, delete: deleteNotice }
const { handleDelete } = useDeleteAndChange(option)

</script>
