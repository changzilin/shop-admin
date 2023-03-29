<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 -->
    <ListHeader @add="handleCreate" @refresh="getData"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" width="380" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch :modelValue="row.status" :loading="row.loading" :disabled="row.super == 1" :active-value="1"
            :inactive-value="0" @change="handleChangeStatus($event, row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template #default="scope">
          <el-button size="small" type="danger" @click="openSetRule(scope.row)">配置权限</el-button>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入角色描述" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDrawer>
    <!-- 权限配置 -->
    <FormDrawer ref="setRoleDrawerRef" title="权限配置" @submit="handleSetRoleSubmit">
      <el-tree-v2 ref="treeRef" :data="ruleList" :check-strictly="checkStrictly" node-key="id"
        :default-expanded-keys="defaultExpandedKeys" :props="{ label: 'name', children: 'child' }" show-checkbox
        :height="treeHeight" @check="handleTreeCheck">
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag :type="data.menu ? '' : 'info'" size="small">{{ data.menu ? "菜单" : "权限" }}</el-tag>
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { ref, nextTick } from "vue"
import ListHeader from "@/components/table/ListHeader.vue"
import { notification } from "@/utils/common.js"
import {
  getRuleList, getRoleList, addRole, updateRole, deleteRole, updateRoleStatus,
  setRoleRules
} from "@/api/manager.js"
import { useInitTable, useInitForm, useDeleteAndChange } from "@/hooks/useTable.js"

// 列表 | 分页 
const optionTable = { getList: getRoleList }
const { tableData, loading, currentPage, total, limit, getData } = useInitTable(optionTable)

// 新增 | 修改
const optionForm = {
  form: {
    name: "",
    desc: "",
    status: 1
  },
  rules: {
    name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
  },
  getData,
  update: updateRole,
  add: addRole
}
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm(optionForm)

// 删除 | 修改状态
const option = { loading, getData, delete: deleteRole, updateStatus: updateRoleStatus }
const { handleDelete, handleChangeStatus } = useDeleteAndChange(option)


// 权限配置
const setRoleDrawerRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const treeRef = ref(null)
// 父子互相关联
const checkStrictly = ref(false)
// 当前角色拥有的权限id
const roleIds = ref([])

// 默认展开一级树
const defaultExpandedKeys = ref([])
// 打开权限配置
async function openSetRule(row) {
  treeHeight.value = (window.innerHeight || document.documentElement.clientHeight) - 186
  roleId.value = row.id
  checkStrictly.value = true
  try {
    let res = await getRuleList(1)
    ruleList.value = res.list
    defaultExpandedKeys.value = res.list.map(item => item.id)
    setRoleDrawerRef.value.open()

    // 当前角色拥有的id
    roleIds.value = row.rules.map(item => item.id)

    nextTick(() => treeRef.value.setCheckedKeys(roleIds.value))
    checkStrictly.value = false
  } finally { }

}

async function handleSetRoleSubmit() {
  setRoleDrawerRef.value.showLoading()
  try {
    await setRoleRules(roleId.value, roleIds.value)
    notification("配置成功")
    getData()
    setRoleDrawerRef.value.close()
  } finally {
    setRoleDrawerRef.value.hideLoading()
  }
}

// 复选框选中
function handleTreeCheck(data, { checkedKeys, halfCheckedKeys }) {
  roleIds.value = [...checkedKeys, ...halfCheckedKeys]
}

</script>
