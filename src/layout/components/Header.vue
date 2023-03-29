<template>
  <div class="header">
    <!-- 左侧 -->
    <div class="flex items-center">
      <span class="logo">
        <el-icon class="mr-2">
          <ElemeFilled />
        </el-icon>
        半城残雪
      </span>
      <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
        <Fold v-if="$store.state.asideWidth == '250px'" />
        <Expand v-else />
      </el-icon>
      <el-tooltip effect="dark" content="刷新" placement="bottom">
        <el-icon class="icon-btn" @click="handleRefresh">
          <Refresh />
        </el-icon>
      </el-tooltip>
    </div>
    <!-- 右侧 -->
    <div class="flex items-center">
      <el-tooltip effect="dark" :content="!isFullscreen ? '全屏' : '退出全屏'" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </el-tooltip>
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="avatar">
          <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!-- 修改密码 -->
  <FormDrawer ref="formDrawer" title="修改密码" destroyOnClose @submit="onSubmit">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" style="width: 98%;">
      <el-form-item prop="oldpassword" label="旧密码">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input v-model="form.password" type="password" show-password placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input v-model="form.repassword" type="password" show-password placeholder="请输入确认密码" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'
import { useRepassword, useLogout } from "@/hooks/useManager.js"
// isFullscreen：是否全屏状态   toggle：切换全屏
const { isFullscreen, toggle } = useFullscreen()

const { form, rules, formRef, formDrawer, onSubmit, openRepassword } = useRepassword()
const { handleLogout } = useLogout()

// 刷新页面
const handleRefresh = () => location.reload()
// 处理菜单项点击事件
function handleCommand(command) {
  if (command == "logout") {
    handleLogout()
  } else {
    openRepassword()
  }
}

</script>

<style scoped>
.header {
  @apply h-[64px] flex items-center justify-between bg-indigo-700 text-light-50;
  @apply p-0 h-auto fixed top-0 right-0 left-0 z-10;
}

.header .logo {
  @apply w-[250px] flex items-center justify-center text-xl font-thin;
}

.icon-btn {
  @apply w-[42px] h-[64px] flex justify-center items-center cursor-pointer;
}

.icon-btn:hover {
  @apply bg-indigo-600;
}

.header .dropdown {
  @apply h-[64px] cursor-pointer flex items-center justify-center mx-5;
}

.dropdown .avatar {
  @apply flex items-center text-light-50 outline-none;
}
</style>