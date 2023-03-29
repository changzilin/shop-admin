<template>
  <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handleOpen">新增图片分类</el-button>
      <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
    </el-header>
    <el-container>
      <ImageAside ref="asideRef" @change="handleChange"></ImageAside>
      <ImageMain ref="imageMainRef"></ImageMain>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from "vue"
import ImageAside from "@/components/image/ImageAside.vue"
import ImageMain from "@/components/image/ImageMain.vue"

// 设置内容的高度
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40

// 新增
const asideRef = ref(null)
const handleOpen = () => asideRef.value.openDrawer()

// 显示分类的图片
const imageMainRef = ref(null)
const handleChange = id => imageMainRef.value.loadData(id)

// 上传图片
const handleOpenUpload = () => imageMainRef.value.openUploadFile()

</script>

<style scoped>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>

