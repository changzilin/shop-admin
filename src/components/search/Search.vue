<template>
  <el-form :model="model" class="mb-3 f-row">
    <el-row :gutter="20" justify="space-between">
      <!-- 默认插槽 -->
      <slot></slot>
      <!-- 高级搜索 -->
      <template v-if="showExpand">
        <slot name="expand"></slot>
      </template>
      <el-col :span="8">
        <div class="flex items-center justify-end">
          <el-button type="primary" @click="$emit('search')">搜索</el-button>
          <el-button type="primary" @click="$emit('reset')">重置</el-button>
          <el-button v-if="hasShowExpand" type="primary" text @click="showExpand = !showExpand">
            {{ showExpand ? "收起" : "展开" }}
            <el-icon>
              <ArrowUp v-if="showExpand" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, useSlots } from "vue"

const slot = useSlots()
const emit = defineEmits(["search", "reset"])
defineProps({ model: Object })
// 收起 | 展开
const showExpand = ref(false)
const hasShowExpand = ref(!!slot.expand)

</script>

<style scoped>
.f-row {
  transition: all 0.3s;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -10%, 0);
    transform: translate3d(0, -10%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 10%, 0);
    transform: translate3d(0, 10%, 0);
  }
}

.fade-enter-active {
  animation: fadeInDown 0.3s;
}

.fade-leave-active {
  animation: fadeOutDown 0.3s;
}
</style>