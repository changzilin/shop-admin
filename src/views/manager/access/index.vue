<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 | 刷新 -->
    <ListHeader @add="handleCreate" @refresh="getData"></ListHeader>
    <!-- 树形菜单 -->
    <el-tree v-loading="loading" :data="tableData" :props="{ label: 'name', children: 'child' }"
      :default-expanded-keys="defaultChecked" node-key="id">
      <template #default="{ node, data }">
        <div class="tree-node">
          <el-tag size="small" :type="data.menu ? '' : 'info'">{{ data.menu ? "菜单" : "权限" }}</el-tag>
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span>{{ data.name }}</span>
          <!-- 右侧 -->
          <div class="ml-auto">
            <!-- modelValue代替v-model,避免修改失败switch依然切换 -->
            <el-switch :modelValue="data.status" :loading="data.loading" :active-value="1" :inactive-value="0"
              @change="handleChangeStatus($event, data)" @click.stop></el-switch>
            <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
            <el-button text type="primary" size="small" v-if="data.menu" @click.stop="addChild(data.id)">增加</el-button>
            <el-popconfirm title="是否删除该记录？" width="171" confirm-button-text="删除" cancel-button-text="取消"
              @confirm="handleDelete(data.id)">
              <template #reference>
                <el-button text type="primary" size="small" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <!-- 新增|修改 -->
    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" style="width: 98%;">
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader v-model="form.rule_id" :options="options"
            :props="{ value: 'id', label: 'name', children: 'child', checkStrictly: true, emitPath: false, expandTrigger: 'hover' }"
            placeholder="请选择上级菜单" clearable />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="form.menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" :input-style="{ width: '30%' }" placeholder="名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
          <IconSelect v-model="form.icon"></IconSelect>
        </el-form-item>
        <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
          <el-input v-model="form.frontpath" placeholder="前端路由" />
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
          <el-input v-model="form.condition" placeholder="后端规则" />
        </el-form-item>
        <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
          <el-select v-model="form.method" placeholder="请选择请求方式">
            <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { ref } from "vue"
import ListHeader from "@/components/table/ListHeader.vue"
import IconSelect from "./IconSelect.vue"
import { getRuleList, updateRule, addRule, updateRuleStatus, deleteRule } from "@/api/manager.js"
import { useInitTable, useInitForm, useDeleteAndChange } from "@/hooks/useTable.js"

// 默认选中一级列表
const defaultChecked = ref([])

const options = ref([])

// 列表 
const optionTable = { getList: getRuleList, onGetListSuccess: handleSuccess }
const { loading, tableData, getData } = useInitTable(optionTable)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.list.map(item => {
    item.loading = false
    return item
  })
  options.value = res.rules
  defaultChecked.value = res.list.map(item => item.id)
}

// 新增 | 修改
const optionForm = {
  form: {
    rule_id: 0,
    menu: 0,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 50,
    icon: "",
    frontpath: ""
  },
  rules: {},
  getData,
  update: updateRule,
  add: addRule
}
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm(optionForm)

// 删除 | 修改状态
const option = { loading, getData, delete: deleteRule, updateStatus: updateRuleStatus }
const { handleDelete, handleChangeStatus } = useDeleteAndChange(option)

// 添加子分类
function addChild(id) {
  handleCreate()
  form.rule_id = id
  form.status = 1
}

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