<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <SearchItem label="关键词">
        <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/会员昵称" clearable />
      </SearchItem>
      <template #expand>
        <SearchItem label="会员等级">
          <el-select v-model="searchForm.user_level_id" placeholder="请选择会员等级" clearable>
            <el-option v-for="item in userLevel" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </SearchItem>
      </template>
    </Search>
    <!-- 新增|刷新 -->
    <ListHeader @add="handleCreate" @refresh="getData"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
      <el-table-column label="会员" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.avatar">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <template #default="{ row }">
          {{ row.user_level?.name ?? "-" }}
        </template>
      </el-table-column>
      <el-table-column label="登录/注册时间" min-width="260" align="center">
        <template #default="{ row }">
          <span v-if="row.last_login_time">
            <el-tag size="small">登录</el-tag>
            {{ row.last_login_time }}
          </span>
          <span v-else>
            <el-tag type="success" size="small">注册</el-tag>
            {{ row.create_time }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="120" align="center">
        <template #default="{ row }">
          <el-switch :modelValue="row.status" :loading="row.loading" :disabled="row.super == 1" :active-value="1"
            :inactive-value="0" @change="handleChangeStatus($event, row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <small v-if="row.super == 1" class="text-sm text-gray-500">暂无操作</small>
          <div v-else>
            <el-button size="small" type="primary" @click="handleEdit(row)">修改</el-button>
            <el-popconfirm title="是否删除该用户？" width="157" confirm-button-text="删除" cancel-button-text="取消"
              @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex justify-center items-center mt-5">
      <!-- <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" /> -->
      <el-pagination v-model:current-page="currentPage" v-model:page-size="searchForm.limit"
        :page-sizes="[10, 20, 30, 40]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="getData" />
    </div>
    <!-- 新增 -->
    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" style="width: 98%;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="图像" prop="avatar">
          <ChooseImage v-model="form.avatar"></ChooseImage>
        </el-form-item>
        <el-form-item label="会员等级" prop="user_level_id">
          <el-select v-model="form.user_level_id" placeholder="请选择会员等级" clearable>
            <el-option v-for="item in userLevel" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="手机" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { ref } from "vue"
import ChooseImage from "@/components/image/ChooseImage.vue"
import ListHeader from "@/components/table/ListHeader.vue"
import Search from "@/components/search/Search.vue"
import SearchItem from "@/components/search/SearchItem.vue"
import { getUserlList, addUser, updateUser, deleteUser, updateUserStatus } from "@/api/user.js"
import { useInitTable, useInitForm, useDeleteAndChange } from "@/hooks/useTable.js"

// 会员等级
const userLevel = ref([])

// 列表 | 分页 | 搜索
const optionTable = {
  searchForm: { keyword: null, user_level_id: null, limit: 10 },
  getList: getUserlList,
  onGetListSuccess: handleSuccess
}
const { searchForm, resetSearchForm, tableData, loading, currentPage, total, getData,
  handleSizeChange
} = useInitTable(optionTable)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.list.map(item => {
    item.loading = false
    return item
  })
  total.value = res.totalCount
  userLevel.value = res.user_level
}

// 新增 | 修改
const optionForm = {
  form: {
    username: "",
    password: "",
    status: 1,
    nickname: "",
    phone: "",
    email: "",
    avatar: "",
    user_level_id: null
  },
  getData,
  update: updateUser,
  add: addUser
}
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm(optionForm)

// 删除 | 修改状态
const option = { loading, getData, updateStatus: updateUserStatus, delete: deleteUser }
const { handleDelete, handleChangeStatus } = useDeleteAndChange(option)

</script>


