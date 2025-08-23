import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageContext, LanguageSelectorWithPreview } from '@renderer/contexts/LanguageContext'
import Button from '@renderer/components/Button/Button'
import './Settings.css'

interface SettingsProps {
  onBack?: () => void
}

const Settings: React.FC<SettingsProps> = () => {
  const navigate = useNavigate()
  const { language } = useContext(LanguageContext)

  // 保存主语言设置到本地存储
  const handleSave = () => {
    localStorage.setItem('mainLanguage', language)
    // 通知应用其他部分语言已更改
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }))
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>设置</h2>
      </div>
      <div className="settings-section">
        <h3>主语言设置</h3>
        <LanguageSelectorWithPreview />
        <div className="settings-actions">
          <Button onClick={() => navigate('/')} className="back-button">
            返回
          </Button>
          <Button primary onClick={handleSave}>
            保存设置
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Settings
