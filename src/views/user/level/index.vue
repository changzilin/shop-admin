<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 -->
    <ListHeader @add="handleCreate" @refresh="getData"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="会员等级" align="center" />
      <el-table-column prop="discount" label="折扣率" align="center" />
      <el-table-column prop="level" label="等级序号" align="center" />
      <el-table-column label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-switch :modelValue="row.status" :loading="row.loading" :disabled="row.super == 1" :active-value="1"
            :inactive-value="0" @change="handleChangeStatus($event, row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否要删除该记录？" width="171" confirm-button-text="删除" cancel-button-text="取消"
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
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" style="width: 98%;">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入等级名称" />
        </el-form-item>
        <el-form-item label="等级权重" prop="level">
          <el-input v-model="form.level" type="number" placeholder="等级权重" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="升级条件">
          <div>
            <small class="text-xs text-rose-400 mr-2">累计消费满</small>
            <el-input v-model="form.max_price" type="number" placeholder="累计消费" style="width: 60%;">
              <template #append>元</template>
            </el-input>
            <small class="text-gray-400 flex">设置会员等级所需要的累计消费必须大于等于0,单位：元</small>
          </div>
          <div>
            <small class="text-xs text-rose-400 mr-2">累计次数满</small>
            <el-input v-model="form.max_times" type="number" placeholder="累计次数" style="width: 60%;">
              <template #append>笔</template>
            </el-input>
            <small class="text-gray-400 flex">设置会员等级所需要的购买量必须大于等于0,单位：笔</small>
          </div>
        </el-form-item>
        <el-form-item label="折扣率(%)" prop="discount">
          <el-input v-model="form.discount" type="number" placeholder="折扣率(%)" style="width: 60%;">
            <template #append>%</template>
          </el-input>
          <small class="text-gray-400 flex">折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</small>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import ListHeader from "@/components/table/ListHeader.vue"
import {
  getUserLevelList, addUserLevel, updateUserLevel, deleteUserLevel,
  updateUserLevelStatus
} from "@/api/user.js"
import { useInitTable, useInitForm, useDeleteAndChange } from "@/hooks/useTable.js"

// 列表 | 分页 
const optionTable = { getList: getUserLevelList }
const { tableData, loading, currentPage, total, limit, getData } = useInitTable(optionTable)

// 新增 | 修改
const optionForm = {
  form: {
    name: "",
    level: 1,
    status: 1,
    discount: 0,
    max_price: 0,
    max_times: 0
  },
  rules: {
    name: [{ required: true, message: '会员等级名称不能为空', trigger: 'blur' }]
  },
  getData,
  update: updateUserLevel,
  add: addUserLevel
}
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm(optionForm)

// 删除 | 修改状态
const option = { loading, getData, delete: deleteUserLevel, updateStatus: updateUserLevelStatus }
const { handleDelete, handleChangeStatus } = useDeleteAndChange(option)

</script>
