<template>
  <el-select :modelValue="modelValue" filterable placeholder="请选择图标" @change="handleChange">
    <el-option v-for="item in icons" :key="item" :label="item" :value="item">
      <div class="flex items-center justify-between">
        <el-icon>
          <component :is="item"></component>
        </el-icon>
        <span class="text-gray-500">{{ item }}</span>
      </div>
    </el-option>
  </el-select>
  <!-- 预览 -->
  <el-icon v-if="modelValue" :size="18" class="ml-2">
    <component :is="modelValue"></component>
  </el-icon>
</template>

<script setup>
import { ref } from "vue"
import * as iconList from '@element-plus/icons-vue'

defineProps({
  modelValue: String
})

const icons = ref(Object.keys(iconList))

const emit = defineEmits(["update:modelValue"])

// 选中图标
function handleChange(icon) {
  emit("update:modelValue", icon)
}

</script>