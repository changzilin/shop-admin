<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <Header></Header>
    </el-header>
    <!-- 中间 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="$store.state.asideWidth">
        <Menu></Menu>
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <!-- 标签导航 -->
        <TagList></TagList>
        <router-view v-slot="{ Component }">
          <!-- 添加overflow-hidden解决快速切换的时候出现x轴滚动条 -->
          <div class="overflow-hidden">
            <!-- 过渡动画 -->
            <Transition name="fade" mode="out-in">
              <!-- 页面缓存 -->
              <KeepAlive :max="10">
                <component :is="Component"></component>
              </KeepAlive>
            </Transition>
          </div>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Header from "./components/Header.vue"
import Menu from "./components/Menu.vue"
import TagList from "./components/TagList.vue"
</script>

<style scoped>
.el-aside {
  transition: all 0.3s;
  z-index: 11;
  /* z-index: 11;解决侧边栏阴影被tag覆盖不显示 */
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-5%, 0, 0);
    transform: translate3d(-5%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeOutRight {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(5%, 0, 0);
    transform: translate3d(5%, 0, 0);
  }
}

.fade-enter-active {
  animation: fadeInLeft 0.3s;
}

.fade-leave-active {
  animation: fadeOutRight 0.3s;
}
</style>