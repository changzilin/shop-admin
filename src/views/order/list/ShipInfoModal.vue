<template>
  <el-drawer v-model="drawerVisible" title="物流信息" size="40%">
    <!-- 头部 -->
    <el-card shadow="never" class="border-0 mb-3">
      <div class="flex items-center">
        <el-image :src="shipInfo.logo" fit="cover" style="width: 60px;height: 60px;" class="border rounded">
        </el-image>
        <div class="ml-2">
          <p>物流公司：{{ shipInfo.typename }}</p>
          <p>物流单号：{{ shipInfo.number }}</p>
        </div>
      </div>
    </el-card>
    <!-- 时间线 -->
    <el-card shadow="never" class="border-0 border-t">
      <el-timeline>
        <el-timeline-item v-for="(item, i) in shipInfo.list" :key="i" :timestamp="item.time" placement="top">
          {{ item.status }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue"
import { getShipInfo } from "@/api/order.js"
import { notification } from "@/utils/common.js"

const props = defineProps({ info: Object })

// 隐藏 | 显示
const drawerVisible = ref(false)

// 打开 | 获取物流信息
const shipInfo = ref({})
async function open(id) {
  try {
    let res = await getShipInfo(id)
    if (res.status != 0) return notification(res.msg, "error")
    shipInfo.value = res.result
    drawerVisible.value = true
    return res
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

defineExpose({ open })
</script>

<style scoped>
:deep(.el-timeline) {
  padding-left: 0;
}
</style>
