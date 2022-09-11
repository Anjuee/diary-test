import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import path from 'path'

export default defineConfig({
  css: {
    modules: {
      // 规避自定义的样式重名的风险
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      },
      scss: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      }
    }
  },

  plugins: [
    react(),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: 'zarm',
          esModule: true,
          resolveStyle: (name) => {
            return `zarm/es/${name}/style/index`
          },
        },
      ],
    }),
  ],

  server: {
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        target: 'http://127.0.0.1:7001/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 将 /api 重写为空
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'utils': path.resolve(__dirname, 'src/utils'), // src 路径
      'config': path.resolve(__dirname, 'src/config') // src 路径
    }
  },
})

