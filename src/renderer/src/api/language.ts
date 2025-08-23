const { ipcRenderer } = window.electron

// 定义语言数据类型
export interface Language {
  id: number
  name: string
  lang: string
}

// 通用的 API 调用函数，包含错误处理和重试机制
const apiCallWithRetry = async <T>(
  call: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error | null = null

  for (let i = 0; i <= retries; i++) {
    try {
      return await call()
    } catch (error) {
      lastError = error as Error
      console.error(`API call failed (attempt ${i + 1}/${retries + 1}):`, error)

      // 如果不是最后一次重试，则等待一段时间后重试
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i))) // 指数退避
      }
    }
  }

  throw new Error(
    `API call failed after ${retries + 1} attempts: ${lastError?.message || 'Unknown error'}`
  )
}

/**
 * 获取语言列表
 */
export const getLanguageList = (): Promise<Language[]> => {
  return apiCallWithRetry(() => ipcRenderer.invoke('getLanguageList'))
}
