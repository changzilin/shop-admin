<template>
  <div v-loading="loading">
    <el-tag v-for="tag in item.goodsSkusCardValue" :key="tag.id" class="mx-1" effect="plain" closable
      :disable-transitions="false" @close="handleClose(tag)">
      <el-input v-model="tag.text" class="w-20 ml-[-10px]" size="small" placeholder="选项值"
        @change="handleChange($event, tag)"></el-input>
    </el-tag>

    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
      @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />

    <el-button v-else class="ml-1" size="small" @click="showInput">
      + 添加选项值
    </el-button>
  </div>
</template>

<script setup>
import { initSkuCardItem } from "@/hooks/useSku.js"

const props = defineProps({
  skuCardId: [Number, String]
})

const { item, inputValue, inputVisible, InputRef, loading, handleClose, showInput,
  handleInputConfirm, handleChange } = initSkuCardItem(props.skuCardId)

</script>