import { ipcMain } from 'electron'
import { select, insert, update } from '@main/electron/db'
import { memoryCache } from './dictionary'

// 定义用户配置数据类型
interface UserProfile {
  id: number
  key: string
  value: string
  created_at: string
  updated_at: string
}

// 获取用户配置项
ipcMain.handle('getUserProfile', async (_, arg) => {
  try {
    // 输入验证
    if (!arg) {
      throw new Error('Argument is required')
    }

    const { key } = JSON.parse(arg)

    // 验证 key 是否为空
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be a non-empty string')
    }

    const results = select('user_profile', { key })
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error('Get user profile failed:', error)
    // 添加详细错误日志
    if (error instanceof SyntaxError) {
      console.error('JSON parsing error in getUserProfile:', error.message)
    } else if (error instanceof Error) {
      console.error('Validation error in getUserProfile:', error.message)
    }
    throw error
  }
})

// 设置用户配置项
ipcMain.handle('setUserProfile', async (_, arg) => {
  try {
    // 输入验证
    if (!arg) {
      throw new Error('Argument is required')
    }

    const { key, value } = JSON.parse(arg)

    // 验证 key 和 value 是否为空
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be a non-empty string')
    }

    if (value === undefined || value === null) {
      throw new Error('Value must be provided')
    }

    // 检查配置项是否已存在
    const existing = select('user_profile', { key })

    if (existing.length > 0) {
      // 更新现有配置项
      const result = update(
        'user_profile',
        { value, updated_at: new Date().toISOString() },
        { key }
      )

      // 如果是主语言设置，同时更新缓存
      if (key === 'main_language') {
        memoryCache.MAIN_LANGUAGE = value
      }

      return result
    } else {
      // 插入新配置项
      const result = insert('user_profile', { key, value })

      // 如果是主语言设置，同时更新缓存
      if (key === 'main_language') {
        memoryCache.MAIN_LANGUAGE = value
      }

      return result
    }
  } catch (error) {
    console.error('Set user profile failed:', error)
    // 添加详细错误日志
    if (error instanceof SyntaxError) {
      console.error('JSON parsing error in setUserProfile:', error.message)
    } else if (error instanceof Error) {
      console.error('Validation error in setUserProfile:', error.message)
    }
    throw error
  }
})

// 获取所有用户配置项
ipcMain.handle('getAllUserProfiles', async () => {
  try {
    const results = select('user_profile')
    return results
  } catch (error) {
    console.error('Get all user profiles failed:', error)
    // 添加详细错误日志
    console.error(
      'Database query error in getAllUserProfiles:',
      error instanceof Error ? error.message : String(error)
    )
    throw error
  }
})
