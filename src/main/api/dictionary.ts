import { ipcMain } from 'electron'
import { insert, select, deleteRecord, update } from '@main/electron/db'
import { FileManager } from '../utils/fileManager'

// 简单的内存缓存对象
export const memoryCache: Record<string, any> = {}

// 定义词典数据类型
interface Dictionary {
  id: number
  name: string
  cover_filename?: string | null
  created_at: string
  updated_at: string
}

interface UpdateDictionaryData {
  [key: string]: unknown
  cover?: string | null // 改为string，因为是base64数据
}

ipcMain.handle('addDictionary', async (_, arg) => {
  const params = JSON.parse(arg)

  try {
    let coverFilename: string | null = null

    if (params.cover) {
      // 保存图片文件，获取文件名
      coverFilename = await FileManager.saveImage(params.cover)
    }

    const result = insert('dictionary', {
      name: params.name,
      cover_filename: coverFilename
    })

    return result
  } catch (error) {
    console.error('Add dictionary failed:', error)
    throw error
  }
})

ipcMain.handle('updateDictionary', async (_, arg) => {
  const { id, ...updateData }: { id: number } & UpdateDictionaryData = JSON.parse(arg)

  try {
    const finalUpdateData: Record<string, unknown> = {}

    if ('cover' in updateData) {
      // 获取当前词典信息
      const current = select('dictionary', { id })[0] as Dictionary
      const oldFilename = current?.cover_filename

      if (updateData.cover) {
        // 有新封面：保存新文件，删除旧文件
        finalUpdateData.cover_filename = await FileManager.updateImage(
          oldFilename || null,
          updateData.cover
        )
      } else {
        // 删除封面：删除文件，清空数据库字段
        if (oldFilename) {
          await FileManager.deleteImage(oldFilename)
        }
        finalUpdateData.cover_filename = null
      }
    }

    // 复制其他更新字段（除了 cover）
    Object.keys(updateData).forEach((key) => {
      if (key !== 'cover') {
        finalUpdateData[key] = updateData[key]
      }
    })

    const result = update('dictionary', finalUpdateData, { id })
    return result
  } catch (error) {
    console.error('Update dictionary failed:', error)
    throw error
  }
})

ipcMain.handle('deleteDictionary', async (_, arg) => {
  const { id } = JSON.parse(arg)

  try {
    // 获取词典信息，删除关联的封面文件
    const dictionary = select('dictionary', { id })[0] as Dictionary
    if (dictionary?.cover_filename) {
      await FileManager.deleteImage(dictionary.cover_filename)
    }

    // 首先删除词典中的所有单词
    deleteRecord('words', { dictionary_id: id })

    // 然后删除词典本身
    return deleteRecord('dictionary', { id })
  } catch (error) {
    console.error('Delete dictionary failed:', error)
    throw error
  }
})

ipcMain.handle('getDictionaryList', async () => {
  try {
    const results = select('dictionary')

    // 为每个词典添加封面 URL (现在 getImageUrl 是异步的)
    const dictionariesWithCovers = await Promise.all(
      results.map(async (dict: Dictionary) => ({
        id: dict.id,
        name: dict.name,
        cover: dict.cover_filename ? await FileManager.getImageUrl(dict.cover_filename) : null,
        created_at: dict.created_at,
        updated_at: dict.updated_at
      }))
    )

    return dictionariesWithCovers
  } catch (error) {
    console.error('Get dictionary list failed:', error)
    throw error
  }
})

// 获取用户主语言设置
const getUserMainLanguage = () => {
  try {
    // 首先尝试从缓存中获取主语言设置
    const cachedLanguage = memoryCache.MAIN_LANGUAGE
    if (cachedLanguage) {
      const languages = select('languages', { lang: cachedLanguage })
      if (languages.length > 0) {
        return languages[0].id
      }
    }

    // 如果缓存中没有，则从数据库获取
    const profiles = select('user_profile', { key: 'main_language' })
    if (profiles.length > 0 && profiles[0].value) {
      // 根据语言代码获取对应的语言ID
      const languageCode = profiles[0].value
      const languages = select('languages', { lang: languageCode })
      if (languages.length > 0) {
        // 将主语言设置保存到内存缓存中
        memoryCache.MAIN_LANGUAGE = languageCode
        return languages[0].id
      }
    }
    // 默认返回中文ID
    return 1
  } catch (error) {
    console.error('Get user main language failed:', error)
    // 默认返回中文ID
    return 1
  }
}

ipcMain.handle('getDictionaryDetial', (_, payload) => {
  const { dictionaryId, params } = JSON.parse(payload)

  // 如果有params.word，则按单词搜索，否则获取所有单词的主要语言版本
  const query = {
    dictionary_id: dictionaryId,
    ...params
  }

  // 如果没有指定语言，则查询用户设置的主要语言版本
  if (!params || !params.lang) {
    const mainLanguageId = getUserMainLanguage()
    query.language_id = mainLanguageId
  }

  const res = select('words', query)

  return res
})

// 获取语言列表
ipcMain.handle('getLanguageList', async () => {
  try {
    const results = select('languages')
    return results
  } catch (error) {
    console.error('Get language list failed:', error)
    throw error
  }
})
