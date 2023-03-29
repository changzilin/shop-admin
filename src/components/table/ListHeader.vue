<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button v-if="btns.includes('add')" type="primary" @click="$emit('add')">新增</el-button>
      <el-popconfirm v-if="btns.includes('delete')" title="是否删除选中的记录？" width="186" confirm-button-text="删除"
        cancel-button-text="取消" @confirm="$emit('delete')">
        <template #reference>
          <el-button type="danger">批量删除</el-button>
        </template>
      </el-popconfirm>
      <slot></slot>
    </div>
    <div>
      <!-- 刷新 -->
      <el-tooltip v-if="btns.includes('refresh')" effect="dark" content="刷新数据" placement="top">
        <el-button text size="small" @click="$emit('refresh')">
          <el-icon :size="15">
            <Refresh />
          </el-icon>
        </el-button>
      </el-tooltip>
      <!-- 导出 -->
      <el-tooltip v-if="btns.includes('download')" effect="dark" content="导出数据" placement="top">
        <el-button text size="small" @click="$emit('download')">
          <el-icon :size="15">
            <Download />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  layout: {
    type: String,
    default: "add,refresh"
  }
})

const btns = computed(() => props.layout.split(","))

defineEmits(["add", "refresh", "delete", "download"])
</script>