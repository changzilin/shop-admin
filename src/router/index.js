import { createRouter, createWebHistory } from "vue-router"
import asyncRoutes from "./routes.js"
import admin from "@/layout/admin.vue"
import login from "@/views/login.vue"
const NotFound = () => import("@/views/404.vue")

// 默认路由，所有用户共享
const routes = [
  {
    path: "/",
    name: "admin",
    component: admin
  },
  {
    path: "/login",
    component: login,
    meta: {
      title: "登录页"
    }
  },
  // 配置404页
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: "404" } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 动态添加路由的方法
export function addRoutes(menus) {
  // 是否有新的路由
  let hasNewRoutes = false
  const findRoutes = arr => {
    arr.forEach(item => {
      // 查找匹配的路由并添加到默认路由的child中
      let route = asyncRoutes.find(e => e.path == item.frontpath)
      if (route && !router.hasRoute(route.path)) {
        router.addRoute("admin", route)
        hasNewRoutes = true
      }
      // 如果有子路由则递归
      if (item.child && item.child.length > 0) {
        findRoutes(item.child)
      }
    });
  }
  findRoutes(menus)
  return hasNewRoutes
}
