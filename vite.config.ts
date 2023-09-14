import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts'
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload()
        }
        // vite: {
        //   build: {
        //     rollupOptions: {
        //       // external: ['sqlite3']
        //     }
        //   }
        // }
      }
    ]),
    renderer(),
    nodeResolve(),
    commonjs({
      dynamicRequireTargets: [
        // include the path to the better-sqlite3.node file
        'node_modules/better-sqlite3/build/better_sqlite3.node'
      ]
    })
  ],
  server: { host: '127.0.0.1', port: 3000 },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
