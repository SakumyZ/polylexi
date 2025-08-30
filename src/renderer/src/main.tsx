import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { logError, logInfo } from './utils/logger'

// 全局错误处理
window.addEventListener('error', (event) => {
  logError(event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason)
})

// 测试日志功能
logInfo('Renderer process started successfully')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

postMessage({ payload: 'removeLoading' }, '*')
