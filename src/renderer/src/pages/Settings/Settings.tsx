import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageSelectorWithPreview } from '@renderer/contexts/LanguageContext'
import Button from '@renderer/components/Button/Button'
import './Settings.css'

interface SettingsProps {
  onBack?: () => void
}

const Settings: React.FC<SettingsProps> = () => {
  const navigate = useNavigate()

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
        </div>
      </div>
    </div>
  )
}

export default Settings
