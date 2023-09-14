const { ipcRenderer } = window.electron

export interface DictionaryOptions {
  id: number
  name: string
  cover: Blob | null
}

export interface WordOptions {
  id: number
  word: string
  word_id: number
  lang: string
}

/**
 * 获取词典列表
 */
export const getDictionaryList = (): Promise<DictionaryOptions[]> => {
  return ipcRenderer.invoke('getDictionaryList')
}

export const addDictionary = (payload: Partial<DictionaryOptions>) => {
  return ipcRenderer.invoke('addDictionary', JSON.stringify(payload))
}

export const getDictionaryDetial = (dictionaryId: string, params?: any): Promise<WordOptions[]> => {
  return ipcRenderer.invoke('getDictionaryDetial', JSON.stringify({ dictionaryId, params }))
}
