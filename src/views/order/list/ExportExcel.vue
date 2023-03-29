<template>
  <el-drawer v-model="drawerVisible" title="导出订单" size="40%">
    <el-form :model="form" label-width="70px" style="width: 98%;">
      <el-form-item label="订单类型">
        <el-select v-model="form.tab" placeholder="请选择订单类型">
          <el-option v-for="(item, i) in tabs" :key="i" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSubmit">导出</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import { exportOrder } from "@/api/order.js"
import { notification } from "@/utils/common.js"

const props = defineProps({ tabs: Array })

const drawerVisible = ref(false)

const form = reactive({
  tab: null,
  time: null
})
const loading = ref(false)
// 打开
const open = () => drawerVisible.value = true
// 关闭
const close = () => drawerVisible.value = false

// 点击导出
async function onSubmit() {
  if (!form.tab) return notification("订单类型不能为空", "error")
  loading.value = true
  // 整理参数
  let data = { tab: form.tab }
  if (form.time && Array.isArray(form.time)) {
    data.starttime = form.time[0]
    data.endtime = form.time[1]
  }
  try {
    let res = await exportOrder(data)
    let url = window.URL.createObjectURL(new Blob([res]))
    let link = document.createElement("a")
    link.style.display = "none"
    link.href = url
    let filename = (new Date()).getTime() + ".xlsx"
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    close()
  } finally {
    loading.value = false
  }
}

defineExpose({ open, close })
</script>