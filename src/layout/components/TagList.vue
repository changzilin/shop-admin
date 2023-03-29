<template>
  <div class="tag-list" :style="{ left: $store.state.asideWidth }">
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane v-for="item in tabList" :key="item.path" :closable="item.path != '/'" :label="item.title"
        :name="item.path">
      </el-tab-pane>
    </el-tabs>
    <!-- 右侧下拉菜单 -->
    <span class="tag-btn">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link outline-none">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <div style="height:44px;"></div>
</template>

<script setup>
import { useTabList } from "@/hooks/useTabList.js"
/* 
  activeTab：当前高亮
  tabList：tab列表
  clickTab：切换tab
  removeTab：删除tab
  handleClose：关闭其他/关闭全部
*/
const { activeTab, tabList, clickTab, removeTab, handleClose } = useTabList()

</script>

<style scoped>
.el-tabs {
  min-width: 100px;
}

.tag-list {
  transition: all 0.3s;
  @apply h-[44px] top-[64px] right-[0px] fixed bg-gray-100 flex justify-between items-center z-10 px-2;
}

.tag-btn {
  @apply h-[32px] px-3 bg-white rounded flex items-center justify-center;
}

:deep(.el-tabs__header) {
  @apply mb-0 flex items-center;
  border: 0 !important;
}

.el-tabs__nav-wrap {
  margin-bottom: 0;
}

:deep(.el-tabs__nav) {
  border: 0 !important;
}

:deep(.el-tabs__item) {
  border: 0 !important;
  height: 32px;
  line-height: 32px;
  @apply bg-white mx-1 rounded;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  height: 32px;
  @apply flex items-center justify-center;
}

:deep(.is-disabled) {
  cursor: not-allowed;
  @apply text-gray-300;
}
</style>