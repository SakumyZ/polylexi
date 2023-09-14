import { ipcMain } from 'electron'
import { insert, select, update } from '../../electron/db'
import { WordMap } from '../api/word'

ipcMain.handle('getWordDetial', (_, payload: any) => {
  const { dictionaryId, wordId } = JSON.parse(payload)

  const res = select('words', {
    dictionary_id: dictionaryId,
    word_id: wordId
  })

  return res
})

const addWord = (dictionaryId: string, wordMap: WordMap) => {
  const main = 'zh-CN'

  const wordKeys = Object.keys(wordMap)

  let wordId = ''

  for (let index = 0; index < wordKeys.length; index++) {
    const key = wordKeys[index]

    if (key === main) {
      const { lastInsertRowid } = insert('words', {
        dictionary_id: dictionaryId,
        word_id: 0,
        word: wordMap[key].word,
        language_id: 1,
        lang: key
      })

      wordId = lastInsertRowid

      update('words', { word_id: lastInsertRowid }, { id: lastInsertRowid })

      // 删除主语言
      wordKeys.splice(index, 1)
      break
    }
    return wordId
  }

  // 插入其他语言
  wordKeys.forEach(key => {
    insert('words', {
      dictionary_id: dictionaryId,
      word_id: wordId,
      word: wordMap[key].word,
      language_id: wordMap[key].id,
      lang: key
    })
  })
}

ipcMain.handle('addWord', (_, payload: any) => {
  const { dictionaryId, wordMap } = JSON.parse(payload) as {
    dictionaryId: string
    wordMap: WordMap
  }
  const wordId = addWord(dictionaryId, wordMap)
  return wordId
})

export const importWords = (wordList: any[]) => {
  const map: any = {
    'zh-CN': 1,
    'en-US': 2,
    'ja-JP': 3
  }

  const dictionaryId = '9'

  wordList.forEach(wordObj => {
    const wordMap: any = {}

    // console.log(wordObj)

    // 遍历 wordObj
    for (const lang in wordObj) {
      if (Object.prototype.hasOwnProperty.call(wordObj, lang)) {
        const word = wordObj[lang]
        wordMap[lang] = {
          id: map[lang],
          lang: word
        }

        // addWord(dictionaryId, wordMap)
      }
    }

    addWord(dictionaryId, wordMap)
  })
}

ipcMain.handle('updateWord', (_, payload: string) => {
  const { dictionaryId, wordMap } = JSON.parse(payload) as {
    dictionaryId: number
    wordMap: WordMap
  }

  for (const key in wordMap) {
    if (Object.prototype.hasOwnProperty.call(wordMap, key)) {
      const { id, word } = wordMap[key]

      update('words', { word }, { id })
    }
  }

  console.log(dictionaryId, wordMap)
})
