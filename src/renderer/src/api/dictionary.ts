const { ipcRenderer } = window.electron

export interface DictionaryOptions {
  id: number
  name: string
  cover: string | null
}

export interface WordOptions {
  id: number
  word: string
  wordId: number
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

export const updateDictionary = (id: number, payload: Partial<DictionaryOptions>) => {
  return ipcRenderer.invoke('updateDictionary', JSON.stringify({ id, ...payload }))
}

export const deleteDictionary = (id: number) => {
  return ipcRenderer.invoke('deleteDictionary', JSON.stringify({ id }))
}

export const getDictionaryDetial = (
  dictionaryId: string,
  params?: Record<string, unknown>
): Promise<WordOptions[]> => {
  return ipcRenderer.invoke('getDictionaryDetial', JSON.stringify({ dictionaryId, params }))
}
