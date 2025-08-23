import { useEffect } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { DialogProvider } from './components/Dialog/DialogProvider'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  // 监听从主进程发送的打开设置页面的消息
  useEffect(() => {
    const handleOpenSettings = () => {
      // 通过路由事件发送消息到 AppRoutes 组件
      window.dispatchEvent(new CustomEvent('open-settings-route'))
    }

    const removeListener = window.electron.ipcRenderer.on('open-settings', handleOpenSettings)

    return () => {
      // 使用返回的移除函数来取消监听
      removeListener()
    }
  }, [])

  return (
    <LanguageProvider>
      <DialogProvider>
        <AppRoutes />
      </DialogProvider>
    </LanguageProvider>
  )
}

export default App
