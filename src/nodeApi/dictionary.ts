import { ipcMain } from 'electron'
import { insert, select } from '../../electron/db'

ipcMain.handle('addDictionary', (_, arg) => {
  const params = JSON.parse(arg)

  return insert('dictionary', params)
})

ipcMain.handle('getDictionaryList', () => {
  const res = select('dictionary')
  return res
})

ipcMain.handle('getDictionaryDetial', (_, payload) => {
  const { dictionaryId, params } = JSON.parse(payload)

  const res = select('words', {
    dictionary_id: dictionaryId,
    language_id: 1,
    ...params
  })

  return res
})
