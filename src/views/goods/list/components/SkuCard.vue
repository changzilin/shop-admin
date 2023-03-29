<template>
  <el-form-item v-loading="bodyLoading" label="规格选项">
    <el-card v-for="(item, index) in skuCardList" :key="item.id" v-loading="item.loading" shadow="never"
      class="w-[98%] mb-3">
      <template #header>
        <div class="flex items-center">
          <!-- 左边 -->
          <el-input v-model="item.text" placeholder="规格名称" style="width:200px;" @change="handleUpdate(item)">
            <template #append>
              <el-icon class="cursor-pointer" @click="handleChooseSku(item)">
                <More />
              </el-icon>
            </template>
          </el-input>
          <!-- 右边 -->
          <el-button class="ml-auto" size="small" :disabled="index == 0" @click="sortCard('up', index)">
            <el-icon>
              <Top />
            </el-icon>
          </el-button>
          <el-button size="small" :disabled="index == (skuCardList.length - 1)" @click="sortCard('down', index)">
            <el-icon>
              <Bottom />
            </el-icon>
          </el-button>
          <el-popconfirm title="是否删除该选项？" width="171" confirm-button-text="删除" cancel-button-text="取消"
            @confirm="handleDelete(item)">
            <template #reference>
              <el-button size="small"><el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <!-- 规格值 -->
      <SkuCardItem :skuCardId="item.id"></SkuCardItem>
    </el-card>
    <el-button type="success" size="small" :loading="btnLoading" @click="addSkuCardEvent">添加规格</el-button>
  </el-form-item>
  <!-- 更多规格 -->
  <ChooseSku ref="chooseSkuRef"></ChooseSku>
</template>

<script setup>
import SkuCardItem from "./SkuCardItem.vue"
import ChooseSku from "@/components/goods/ChooseSku.vue"
import {
  skuCardList, addSkuCardEvent, btnLoading, handleUpdate, handleDelete, sortCard,
  bodyLoading, chooseSetGoodsSkusCard
} from "@/hooks/useSku.js"
import { ref } from "vue";

const chooseSkuRef = ref(null)
// 更多规格
function handleChooseSku(item) {
  chooseSkuRef.value.open(value => {
    chooseSetGoodsSkusCard(item.id, {
      name: value.name,
      value: value.list
    })
  })
}


</script>

<style scoped>
:deep(.el-card__header) {
  @apply p-2 bg-gray-50;
}
</style>