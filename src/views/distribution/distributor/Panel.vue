<template>
  <el-row :gutter="20" class="mb-5">
    <!-- 骨架屏 -->
    <template v-if="loading">
      <el-col :span="6" v-for="i in 4" :key="i">
        <el-skeleton style="width: 100%" animated loading>
          <template #template>
            <el-card class="border-0" shadow="never">
              <div class="flex items-center">
                <el-skeleton-item variant="circle" style="width: 40px;height: 40px;" />
                <div class="ml-2 flex-1">
                  <el-skeleton-item variant="h3" style="width: 15%;" />
                  <el-skeleton-item variant="p" />
                </div>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>
    <el-col v-for="(item, index) in list" :key="index" :span="6">
      <el-card shadow="never">
        <div class="flex items-center">
          <el-icon :class="getColor(index)" class="panel-icon" :size="20">
            <User v-if="index == 0" />
            <ShoppingCart v-else-if="index == 1" />
            <PriceTag v-else-if="index == 2" />
            <Timer v-else />
          </el-icon>
          <div class="ml-2">
            <h2 class="text-lg font-bold">{{ item.value }}</h2>
            <small class="text-xs text-gray-400">{{ item.label }}</small>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from "vue"
import { getAgentStatistics } from "@/api/distribution.js"

// 获取数据
const loading = ref(false)
const list = ref([])
async function getData() {
  loading.value = true
  try {
    let res = await getAgentStatistics()
    list.value = res.panels
  } finally {
    loading.value = false
  }
}
getData()

function getColor(index) {
  switch (index) {
    case 0: return "bg-blue-400"
    case 1: return "bg-orange-400"
    case 2: return "bg-green-400"
    case 3: return "bg-indigo-400"
  }
}
</script>

<style scoped>
.panel-icon {
  @apply text-white w-[40px] h-[40px] rounded-full;
}
</style>

