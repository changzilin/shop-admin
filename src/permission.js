import { router, addRoutes } from "@/router/index.js"
import store from "@/store/index.js"
import NProgress from "nprogress"
import { getToken } from "@/utils/token.js"
import { notification } from "@/utils/common.js"

// 全局前置守卫
router.beforeEach(async (to, from) => {
  NProgress.start() // 开启进度条
  const token = getToken()
  // 没有登录跳转回登录页
  if (!token && to.path != "/login") {
    notification("请先登录！", "error")
    return "/login"
  }
  // 防止重复登录

  if (token && to.path == "/login") {
    notification("请勿重复登录！", "error")
    // 使用HTML5 模式无法获取from.path,使用Hash 模式则可以实现回退功能
    return from.path ? from.path : "/"
  }
  // 如果用户登录了，自动获取用户信息，存储vuex中
  let hasNewRoutes = false
  if (token && !store.state.user.id) {
    let { menus } = await store.dispatch("getUserInfo")
    hasNewRoutes = addRoutes(menus)
  }

  // 设置页面标题
  document.title = to.meta.title ? to.meta.title : "商城后台管理系统"
  if (hasNewRoutes) return to.fullPath
})

// 全局后置守卫
router.afterEach((to, from) => {
  NProgress.done() // 关闭进度条
})

export default router