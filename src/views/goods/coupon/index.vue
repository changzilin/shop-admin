<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 -->
    <ListHeader @add="handleCreate" @refresh="getData"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column label="优惠券名称" width="340">
        <template #default="{ row }">
          <div class="border border-dashed py-2 px-4 rounded" :class="row.statusText == '领取中' ? 'active' : 'inactive'">
            <h5 class="font-bold text-md">{{ row.name }}</h5>
            <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusText" label="状态" align="center" />
      <el-table-column label="优惠" align="center" width="200">
        <template #default="{ row }">
          {{ row.type == 0 ? "满减" : "折扣" }} {{ row.type == 0 ? `￥${row.value}` : `${row.value}折` }}
        </template>
      </el-table-column>
      <el-table-column prop="total" label="发放数量" align="center" />
      <el-table-column prop="used" label="已使用" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button v-if="scope.row.statusText == '未开始'" size="small" type="primary"
            @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm v-if="scope.row.statusText != '领取中'" title="是否要删除该优惠券？" width="185" confirm-button-text="删除"
            cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.statusText == '领取中'" title="是否要该优惠券失效？" width="185" confirm-button-text="失效"
            cancel-button-text="取消" @confirm="handleChangeStatus(0, scope.row)">
            <template #reference>
              <el-button size="small" type="danger">失效</el-button>
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
      <el-form :model="form" ref="formRef" :rules="rules" label-width="98px" style="width: 98%;">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入优惠券名称" style="width: 60%;" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="0" border>满减</el-radio>
            <el-radio :label="1" border>折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面值" prop="value">
          <el-input v-model="form.value" placeholder="面值" style="width: 60%;">
            <template #append>{{ form.type ? "折" : "元" }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发行量" prop="total">
          <el-input-number v-model="form.total" :min="0" />
        </el-form-item>
        <el-form-item label="最低使用价格" prop="min_price">
          <el-input v-model="form.min_price" placeholder="最低使用价格" style="width: 60%;" />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
        <el-form-item label="活动时间" prop="start_time">
          <el-date-picker v-model="timerange" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="描述" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { computed } from "vue"
import ListHeader from "@/components/table/ListHeader.vue"
import { notification } from "@/utils/common.js"
import { getCouponList, updateCoupon, addCoupon, deleteCoupon, updateCouponStatus } from "@/api/goods.js"
import { useInitTable, useInitForm, useDeleteAndChange } from "@/hooks/useTable.js"

// 列表 | 分页 
const optionTable = { getList: getCouponList, onGetListSuccess: handleSuccess }
const { tableData, loading, currentPage, total, limit, getData } = useInitTable(optionTable)
// 处理响应的结果
function handleSuccess(res) {
  tableData.value = res.list.map(item => {
    // 转换优惠券状态
    item.statusText = foramtStatus(item)
    return item
  })
  total.value = res.totalCount
}

// 处理新增前的参数
function beforeSubmit(value) {
  if (typeof value.start_time != "number") {
    value.start_time = new Date(value.start_time).getTime()
  }
  if (typeof value.end_time != "number") {
    value.end_time = new Date(value.end_time).getTime()
  }
  return value
}
// 新增 | 修改
const optionForm = {
  form: {
    name: "",
    type: 0,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: null,
    end_time: null,
    order: 50,
    desc: ""
  },
  getData,
  update: updateCoupon,
  add: addCoupon,
  beforeSubmit
}
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm(optionForm)

// 删除
const option = { loading, getData, delete: deleteCoupon }
const { handleDelete } = useDeleteAndChange(option)

// 格式化当前状态
function foramtStatus(item) {
  let str = "领取中"
  let start_time = new Date(item.start_time).getTime()
  let now_time = new Date().getTime()
  let end_time = new Date(item.end_time).getTime()
  if (start_time > now_time) {
    str = "未开始"
  } else if (end_time < now_time) {
    str = "已结束"
  } else if (item.status == 0) {
    str = "已失效"
  }
  return str
}

// 失效
async function handleChangeStatus(status, row) {
  loading.value = true
  try {
    await updateCouponStatus(row.id, status)
    notification("失效成功")
    getData()
  } finally {
    loading.value = false
  }
}

// 活动时间
const timerange = computed({
  get() {
    return (form.start_time && form.end_time) ? [form.start_time, form.end_time] : []
  },
  set(value) {
    form.start_time = value.at(0)
    form.end_time = value.at(-1)
  }
})

</script>

<style scoped>
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
}

.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
