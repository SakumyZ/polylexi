import React, { useState, useEffect } from 'react'
import Flag from '@renderer/components/Flag/Flag'
import { getUserProfile, setUserProfile } from '@renderer/api/userProfile'
import { getLanguageList, Language } from '@renderer/api/language'

// 创建语言上下文
interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  languages: Language[]
  loading: boolean
  error: string | null
}

export const LanguageContext = React.createContext<LanguageContextType>({
  language: 'zh-CN',
  setLanguage: () => {},
  languages: [],
  loading: false,
  error: null
})

// 语言提供者组件
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('zh-CN')
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 组件加载时从数据库获取主语言设置和语言列表
  useEffect(() => {
    const loadLanguageData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 获取语言列表
        const languageList = await getLanguageList()
        setLanguages(languageList)

        // 获取主语言设置
        const profile = await getUserProfile('main_language')
        if (profile && profile.value) {
          setLanguage(profile.value)
          // 同时保存到 localStorage 作为缓存
          localStorage.setItem('mainLanguage', profile.value)
        } else {
          // 如果数据库中没有设置，尝试从 localStorage 加载
          const savedLanguage = localStorage.getItem('mainLanguage')
          if (savedLanguage) {
            setLanguage(savedLanguage)
          }
        }
      } catch (error) {
        console.error('Failed to load language data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load language data')

        // 如果数据库加载失败，使用默认语言列表
        const defaultLanguages = [
          { id: 1, name: '中文', lang: 'zh-CN' },
          { id: 2, name: 'English', lang: 'en-US' },
          { id: 3, name: '日本語', lang: 'ja-JP' }
        ]
        setLanguages(defaultLanguages)

        // 如果数据库加载失败，尝试从 localStorage 加载（回退机制）
        const savedLanguage = localStorage.getItem('mainLanguage')
        if (savedLanguage) {
          setLanguage(savedLanguage)
        }
      } finally {
        setLoading(false)
      }
    }

    loadLanguageData()

    // 监听语言更改事件
    const handleLanguageChange = (e: CustomEvent) => {
      setLanguage(e.detail)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  // 重写 setLanguage 函数，使其同时更新数据库和 localStorage
  const updateLanguage = async (lang: string) => {
    try {
      // 更新数据库中的设置
      await setUserProfile('main_language', lang)
      // 同时更新 localStorage 作为回退机制
      localStorage.setItem('mainLanguage', lang)
      // 更新状态
      setLanguage(lang)
      // 通知应用其他部分语言已更改
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
    } catch (error) {
      console.error('Failed to save language setting:', error)
      // 如果数据库保存失败，至少更新 localStorage 和状态
      localStorage.setItem('mainLanguage', lang)
      setLanguage(lang)
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
    }
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: updateLanguage, languages, loading, error }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

// 语言选择下拉菜单组件
export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages, loading, error } = React.useContext(LanguageContext)

  if (loading) {
    return <div>Loading languages...</div>
  }

  if (error) {
    return <div>Error loading languages: {error}</div>
  }

  return (
    <select
      value={language}
      onChange={(e) => {
        const newLanguage = e.target.value
        setLanguage(newLanguage)
      }}
      className="language-selector"
    >
      {languages.map((lang) => (
        <option key={lang.lang} value={lang.lang}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}

// 语言选择器组件（包含可视化选项）
export const LanguageSelectorWithPreview: React.FC = () => {
  const { language, setLanguage, languages, loading, error } = React.useContext(LanguageContext)

  if (loading) {
    return <div>Loading languages...</div>
  }

  if (error) {
    return <div>Error loading languages: {error}</div>
  }

  return (
    <div className="language-selector-container">
      <div className="language-preview">
        {languages.map((lang) => (
          <div
            key={lang.lang}
            className={`language-option ${language === lang.lang ? 'selected' : ''}`}
            onClick={() => {
              setLanguage(lang.lang)
            }}
          >
            <Flag lang={lang.lang} />
            <span>{lang.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
