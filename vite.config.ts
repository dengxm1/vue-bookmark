import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
     AutoImport({
      resolvers: [ElementPlusResolver()],
      // 自动导入 Vue 相关函数
      imports: [
        'vue',
        'vue-router',
        'pinia'
      ],
      dts: true, // 生成自动导入的 TypeScript 声明
      eslintrc: {
        enabled: false, // 先关闭 eslint 配置，避免冲突
      }
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true // 生成组件的 TypeScript 声明
    })
  ],
    build: {
    minify: 'esbuild', // 启用 JS 压缩
    cssMinify: false,  // 禁用 CSS 压缩
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
   server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
