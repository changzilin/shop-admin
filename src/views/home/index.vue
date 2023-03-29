<template>
  <div>
    <!-- 骨架屏 -->
    <template v-if="skeletonVisible">
      <!-- 顶部卡片 -->
      <el-row :gutter="20">
        <el-col :span="6" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card class="border-0" shadow="never">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%;" />
                    <el-skeleton-item variant="text" style="width: 10%;" />
                  </div>
                </template>
                <el-skeleton-item variant="h3" style="width: 30%;" />
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%;" />
                  <el-skeleton-item variant="text" style="width: 10%;" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </el-row>
      <!-- navs -->
      <el-row :gutter="20" class="mt-5">
        <el-col v-for="i in 8" :key="i" :span="3">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card class="border-0" shadow="never">
                <div class="flex flex-col justify-center items-center">
                  <el-skeleton-item variant="circle" class="w-4 h-4" />
                  <el-skeleton-item variant="text" class="w-8 mt-2" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </el-row>
      <!-- 图表|待付款 -->
      <el-row :gutter="20" class="mt-5">
        <el-col :span="12">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="never">
                <template #header>
                  <div class="flex">
                    <el-skeleton-item variant="p" class="w-12 h-4" />
                    <el-skeleton-item variant="p" class="w-[80px] h-6 mr-2 ml-auto" />
                    <el-skeleton-item variant="p" class="w-[80px] h-6 mr-2" />
                    <el-skeleton-item variant="p" class="w-[80px] h-6 mr-2" />
                  </div>
                </template>
                <el-skeleton-item variant="rect" class="w-full h-[300px]" />
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
        <el-col :span="12">
          <el-skeleton v-for="index in 2" :key="index" style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="never" class="mb-4">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="p" class="w-12 h-4" />
                    <el-skeleton-item variant="p" class="w-[100px] h-4" />
                  </div>
                </template>
                <el-row :gutter="20" class="py-2">
                  <el-col :span="6" v-for="i in 4" :key="i">
                    <el-card shadow="never" class="border-0 bg-light-400">
                      <div class="flex flex-col items-center justify-center">
                        <el-skeleton-item variant="p" class="w-6 h-4" />
                        <el-skeleton-item variant="caption" class="w-10 h-4 mt-2" />
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <!-- 顶部卡片 -->
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in panels" :key="index">
          <el-card class="border-0" shadow="hover">
            <template #header>
              <div class="flex justify-between">
                <span class="text-sm">{{ item.title }}</span>
                <el-tag :type="item.unitColor" effect="plain">
                  {{ item.unit }}
                </el-tag>
              </div>
            </template>
            <span class="text-3xl font-bold text-gray-500">
              <!-- 数字滚动 -->
              <CountTo :value="item.value"></CountTo>
            </span>
            <el-divider />
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ item.subTitle }}</span>
              <span>{{ item.subValue }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <Navs></Navs>
      <!-- 图表|待付款 -->
      <el-row :gutter="20" class="mt-5">
        <el-col :span="12">
          <!-- v-permission:权限控制 -->
          <Chart v-permission="['getStatistics3,GET']"></Chart>
        </el-col>
        <el-col :span="12">
          <Card title="店铺及商品提示" tip="店铺及商品提示" :btns="goods" class="mb-3"></Card>
          <Card title="交易提示" tip="需要立即处理的交易订单" :btns="order"></Card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>
<script setup>
import { ref, computed } from "vue"
import { getStatistics1, getStatistics2 } from "@/api/index.js"
import CountTo from "@/components/CountTo.vue"
import Navs from "./Navs.vue"
import Chart from "./Chart.vue"
import Card from "./Card.vue"

// 顶部数据面板
let panels = ref([])
// 获取顶部数据面板数据
getStatistics1().then(res => panels.value = res.panels)

// 获取商品及订单数据
const goods = ref([])
const order = ref([])
getStatistics2().then(res => {
  goods.value = res.goods
  order.value = res.order
})

// 是否显示骨架屏
const skeletonVisible = computed(() => {
  return (panels.value.length == 0 && goods.value.length == 0 && order.value.length == 0)
})

</script>