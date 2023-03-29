import { createApp } from 'vue'
import router from "@/permission.js"
import store from "@/store/index.js"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/dist/locale/zh-cn.mjs'
import permission from "@/directives/permission.js"
import FormDrawer from "@/components/table/FormDrawer.vue"
import 'element-plus/dist/index.css'
import 'virtual:windi.css'
import "nprogress/nprogress.css"
import "@/assets/index.css"
import App from '@/App.vue'

const app = createApp(App)
app.use(ElementPlus, { locale })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册全局组件
app.component("FormDrawer", FormDrawer)

app.use(router)
app.use(store)
// 使用自定义插件
app.use(permission)

app.mount('#app')
