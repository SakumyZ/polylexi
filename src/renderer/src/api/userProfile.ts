const { ipcRenderer } = window.electron

// 定义用户配置数据类型
export interface UserProfile {
  id: number
  key: string
  value: string
  created_at: string
  updated_at: string
}

// 通用的 API 调用函数，包含错误处理和重试机制
const apiCallWithRetry = async <T>(
  call: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error

  for (let i = 0; i <= retries; i++) {
    try {
      return await call()
    } catch (error) {
      lastError = error as Error
      console.error(`API call failed (attempt ${i + 1}/${retries + 1}):`, error)

      // 如果不是最后一次重试，则等待一段时间后重试
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))) // 指数退避
      }
    }
  }

  throw new Error(`API call failed after ${retries + 1} attempts: ${lastError?.message}`)
}

/**
 * 获取用户配置项
 */
export const getUserProfile = (key: string): Promise<UserProfile | null> => {
  return apiCallWithRetry(() => ipcRenderer.invoke('getUserProfile', JSON.stringify({ key })))
}

/**
 * 设置用户配置项
 */
export const setUserProfile = (key: string, value: string): Promise<any> => {
  return apiCallWithRetry(() => ipcRenderer.invoke('setUserProfile', JSON.stringify({ key, value })))
}

/**
 * 获取所有用户配置项
 */
export const getAllUserProfiles = (): Promise<UserProfile[]> => {
  return apiCallWithRetry(() => ipcRenderer.invoke('getAllUserProfiles'))
}