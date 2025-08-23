import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Home from '@renderer/pages/Home/Home'
import Detial from '@renderer/pages/Detial/Detial'
import Settings from '@renderer/pages/Settings/Settings'

const AppRoutesContent: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleOpenSettings = (event: Electron.IpcRendererEvent) => {
      navigate('/settings')
    }

    const handleOpenSettingsRoute = () => {
      navigate('/settings')
    }

    // 监听主进程发送的打开设置页面的消息
    const removeListener = window.electron.ipcRenderer.on('open-settings', handleOpenSettings)
    
    // 监听自定义事件（从 App 组件发送）
    window.addEventListener('open-settings-route', handleOpenSettingsRoute)

    return () => {
      removeListener()
      window.removeEventListener('open-settings-route', handleOpenSettingsRoute)
    }
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail/:dictionaryId" element={<Detial />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <AppRoutesContent />
    </Router>
  )
}

export default AppRoutes
