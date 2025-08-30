import { ipcMain } from 'electron'
import { insert, select, update, deleteRecord } from '../electron/db'
import { WordMap } from '../typings/word'

interface WordDetailResponse {
  id: number
  dictionary_id: number
  language_id: number
  lang: string
  wordId: number
  word: string
  created_at: string
  updated_at: string
}

ipcMain.handle('getWordDetial', (_, payload: string): WordDetailResponse[] => {
  const { dictionaryId, wordId } = JSON.parse(payload) as {
    dictionaryId: string
    wordId: string
  }

  const res = select('words', {
    dictionary_id: dictionaryId,
    wordId
  })

  return res
})

const addWord = (dictionaryId: string, wordMap: WordMap): string => {
  const main = 'zh-CN'

  const wordKeys = Object.keys(wordMap)

  let wordId = ''

  for (let index = 0; index < wordKeys.length; index++) {
    const key = wordKeys[index]

    if (key === main) {
      const { lastInsertRowid } = insert('words', {
        dictionary_id: dictionaryId,
        wordId: 0,
        word: wordMap[key].word,
        language_id: 1,
        lang: key
      })

      wordId = lastInsertRowid.toString()

      update('words', { wordId: lastInsertRowid }, { id: lastInsertRowid })

      // 删除主语言
      wordKeys.splice(index, 1)
      break
    }
  }

  // 如果没有找到主语言，返回空字符串
  if (!wordId) {
    return ''
  }

  // 插入其他语言
  wordKeys.forEach((key) => {
    insert('words', {
      dictionary_id: dictionaryId,
      wordId,
      word: wordMap[key].word,
      language_id: wordMap[key].id,
      lang: key
    })
  })

  return wordId
}

ipcMain.handle('addWord', (_, payload: string) => {
  const { dictionaryId, wordMap } = JSON.parse(payload) as {
    dictionaryId: string
    wordMap: WordMap
  }

  const wordId = addWord(dictionaryId, wordMap)
  return wordId
})

export const importWords = (wordList: Record<string, string>[]) => {
  const map: Record<string, number> = {
    'zh-CN': 1,
    'en-US': 2,
    'ja-JP': 3
  }

  const dictionaryId = '9'

  wordList.forEach((wordObj) => {
    const wordMap: WordMap = {}

    // console.log(wordObj)

    // 遍历 wordObj
    for (const lang in wordObj) {
      if (Object.prototype.hasOwnProperty.call(wordObj, lang)) {
        const word = wordObj[lang]
        wordMap[lang] = {
          id: map[lang],
          word: word
        }

        // addWord(dictionaryId, wordMap)
      }
    }

    addWord(dictionaryId, wordMap)
  })
}

ipcMain.handle('updateWord', (_, payload: string): { success: boolean } => {
  const { wordMap } = JSON.parse(payload) as {
    dictionaryId: string
    wordMap: WordMap
  }

  for (const key in wordMap) {
    if (Object.prototype.hasOwnProperty.call(wordMap, key)) {
      const { id, word } = wordMap[key]

      update('words', { word }, { id })
    }
  }

  return { success: true }
})

ipcMain.handle('deleteWord', (_, payload: string): { success: boolean } => {
  const { dictionaryId, wordId } = JSON.parse(payload) as {
    dictionaryId: string
    wordId: string
  }

  // 删除该单词的所有语言版本
  deleteRecord('words', {
    dictionary_id: dictionaryId,
    wordId
  })

  return { success: true }
})
