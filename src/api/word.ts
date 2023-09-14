import { WordOptions } from './dictionary'

const { ipcRenderer } = window.electron

type Lang = string

export type WordMap = Record<Lang, { id: number; word: string }>

export const getWordDetial = (dictionaryId: string, wordId: string): Promise<WordOptions[]> => {
  return ipcRenderer.invoke('getWordDetial', JSON.stringify({ dictionaryId, wordId }))
}

export const addWord = (dictionaryId: string, wordMap: WordMap): Promise<string> => {
  return ipcRenderer.invoke('addWord', JSON.stringify({ dictionaryId, wordMap }))
}

export const updateWord = (dictionaryId: string, wordMap: WordMap): Promise<void> => {
  return ipcRenderer.invoke('updateWord', JSON.stringify({ dictionaryId, wordMap }))
}
