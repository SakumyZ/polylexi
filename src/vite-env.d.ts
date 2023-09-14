/// <reference types="vite/client" />

// 扩充 window 类型，加上 electron 属性
interface Window {
  electron: Electron
}
