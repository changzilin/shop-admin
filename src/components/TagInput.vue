<template>
  <el-tag v-for="tag in dynamicTags" :key="tag" class="mx-1 my-0.5" closable :disable-transitions="false"
    @close="handleClose(tag)">
    {{ tag }}
  </el-tag>
  <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 my-0.5 w-20" size="small"
    @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
  <el-button v-else class="ml-1 my-0.5" size="small" @click="showInput">+ 添加值</el-button>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

// v-model的值
const props = defineProps({ modelValue: String })
const emit = defineEmits(["update:modelValue"])

const inputValue = ref('')
const dynamicTags = ref([])
const inputVisible = ref(false)
const InputRef = ref()

// 初始化dynamicTags
const initTags = () => dynamicTags.value = props.modelValue ? props.modelValue.split(",") : []
initTags()

watch(() => props.modelValue, () => initTags())

// 关闭tag
const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  emit("update:modelValue", dynamicTags.value.join(","))
}

// 显示input框并聚焦
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

// 显示添加按钮
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
    emit("update:modelValue", dynamicTags.value.join(","))
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>