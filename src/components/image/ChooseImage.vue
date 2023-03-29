<template>
  <div class="flex flex-wrap">
    <template v-if="modelValue && preview">
      <!-- 预览 -->
      <div v-if="typeof modelValue == 'string'" class="containe-image">
        <el-image :src="modelValue" fit="cover" :preview-src-list="[modelValue]" :initial-index="0" hide-on-click-modal
          preview-teleported class="preview-image">
        </el-image>
      </div>
      <div v-else class="flex flex-wrap">
        <div v-for="(url, index) in modelValue" :key="index" class="containe-image">
          <el-icon class="close-image" @click="removeImage(url)">
            <CircleClose />
          </el-icon>
          <el-image :src="url" fit="cover" :preview-src-list="modelValue" :initial-index="index" hide-on-click-modal
            preview-teleported class="preview-image">
          </el-image>
        </div>
        <div class="choose-image" @click="open">
          <el-icon :size="25" class="text-gray-500">
            <Plus />
          </el-icon>
        </div>
      </div>
    </template>
    <!-- 添加图片 -->
    <div v-if="!Array.isArray(modelValue) && preview" class="choose-image" @click="open">
      <el-icon :size="25" class="text-gray-500">
        <Plus />
      </el-icon>
    </div>
  </div>
  <!-- 图片选择 -->
  <el-dialog v-model="dialogVisible" title="选择图片" width="80%" align-center>
    <el-container class="bg-white rounded" style="height:70vh;">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpen">新增图片分类</el-button>
        <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
      </el-header>
      <el-container>
        <ImageAside ref="asideRef" @change="handleChange"></ImageAside>
        <ImageMain ref="imageMainRef" :limit="limit" choose @choose="handleChoose"></ImageMain>
      </el-container>
    </el-container>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue"
import ImageAside from "./ImageAside.vue"
import ImageMain from "./ImageMain.vue"
import { notification } from "@/utils/common.js"

// 图片选择显示|隐藏
const dialogVisible = ref(false)

const callbackFun = ref(null)
// 打开
function open(callback = null) {
  callbackFun.value = callback
  dialogVisible.value = true
}

// 关闭
const close = () => dialogVisible.value = false

// 新增
const asideRef = ref(null)
const handleOpen = () => asideRef.value.openDrawer()

// 显示分类的图片
const imageMainRef = ref(null)
const handleChange = id => imageMainRef.value.loadData(id)

// 上传图片
const handleOpenUpload = () => imageMainRef.value.openUploadFile()

const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1
  },
  preview: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(["update:modelValue"])

// 选中图片
let urls = []
const handleChoose = img => urls = img.map(item => item.url)

// 提交
const submit = () => {
  let value = []
  if (props.limit == 1) {
    value = urls[0]
  } else {
    value = props.preview ? [...props.modelValue, ...urls] : [...urls]
    if (value.length > props.limit) {
      let limit = props.preview ? (props.limit - props.modelValue.length) : props.limit
      return notification(`最多还能选择${limit}张`, "error")
    }
  }
  if (value && props.preview) {
    emit("update:modelValue", value)
  } else if (!props.preview && typeof callbackFun.value == "function") {
    callbackFun.value(value)
  } else {
    notification("请先选择图片", "error")
  }
  close()
}

// 移除图片
const removeImage = url => emit("update:modelValue", props.modelValue.filter(item => item != url))

defineExpose({ open, close })
</script>

<style scoped>
.containe-image {
  @apply relative mb-2 w-[100px] h-[100px] mr-2;
}

.preview-image {
  @apply w-[100px] h-[100px] rounded border mr-2;
}

.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center px-0;
}

.choose-image {
  height: 100px;
  width: 100px;
  @apply rounded border border-dashed flex items-center justify-center cursor-pointer hover: (bg-gray-100);
}

.close-image {
  z-index: 2;
  @apply absolute right-[5px] top-[5px] cursor-pointer bg-white rounded-full;
}
</style>
