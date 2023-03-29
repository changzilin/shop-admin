import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  // 配置别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  // 配置插件
  plugins: [
    vue(),
    WindiCSS()
  ],
  // 配置代理
  server: {
    proxy: {
      '/api': {
        target: 'http://ceshi13.dishait.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
