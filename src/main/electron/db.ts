// eslint-disable-next-line
const Database = require('better-sqlite3')
import { toCamelCase, toSnakeCase } from '@main/utils/namingConverter'
import logger from '@main/utils/logger'

/**
 * 初始化数据库
 */
export const initDB = () => {
  const db = new Database('data.db')

  // 先创建基础表结构
  db.exec(`
    CREATE TABLE IF NOT EXISTS dictionary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cover BLOB,
      cover_filename TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 为 dictionary 表的 name 字段添加索引，提高查询性能
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_dictionary_name ON dictionary (name)
  `)

  // 检查是否需要迁移数据库（只有在表存在的情况下才检查）
  try {
    const tableInfo = db.pragma('table_info(dictionary)')
    const hasCoverFilename = tableInfo.some(
      (col: { name: string }) => col.name === 'cover_filename'
    )

    if (!hasCoverFilename) {
      // 需要迁移：添加新字段并清理旧数据
      db.exec(`
        ALTER TABLE dictionary ADD COLUMN cover_filename TEXT;
      `)

      // 清理旧的 BLOB 数据，因为我们要改用文件存储
      db.exec(`
        UPDATE dictionary SET cover = NULL;
      `)
    }
  } catch {
    // 如果检查失败，说明是全新数据库，无需迁移
    logger.info('Database is new, no migration needed')
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      lang TEXT NOT NULL
    )
  `)

  // 为 languages 表的 lang 字段添加索引，提高查询性能
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_languages_lang ON languages (lang)
  `)

  // 插入默认语言数据
  db.exec(`
    INSERT OR IGNORE INTO languages (id, name, lang) VALUES
    (1, '中文', 'zh-CN'),
    (2, 'English', 'en-US'),
    (3, '日本語', 'ja-JP')
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY,
      dictionary_id INTEGER NOT NULL,
      language_id INTEGER NOT NULL,
      lang TEXT NOT NULL,
      word_id INTEGER NOT NULL,
      word TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY (language_id) REFERENCES languages(id),
      FOREIGN KEY (dictionary_id) REFERENCES dictionary(id)
    )
  `)

  // 为 words 表的关键字段添加索引，提高查询性能
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_words_dictionary_id ON words (dictionary_id)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_words_language_id ON words (language_id)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_words_word_id ON words (word_id)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_words_lang ON words (lang)
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS tag (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS word_tag (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (word_id) REFERENCES word (id),
      FOREIGN KEY (tag_id) REFERENCES tag (id)
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (word_id) REFERENCES word (id)
    )
  `)

  // 创建用户配置表
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 为用户配置表的 key 字段添加索引，提高查询性能
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_profile_key ON user_profile (key)
  `)

  db.close()
}

/**
 * 执行 sql 语句
 *
 * @param sql 待执行 sql
 */
export const exec = (sql: string) => {
  const db = new Database('data.db')
  const stmt = db.prepare(sql)
  const result = stmt.run()

  db.close()
  return result
}

export const select = (tableName: string, params?: Record<string, unknown>): any[] => {
  let sql = ''

  if (params) {
    // 转换参数键名为下划线风格
    const dbParams = toSnakeCase(params)
    sql = `SELECT * FROM ${tableName.toUpperCase()} WHERE ${Object.keys(dbParams)
      .map((key) => {
        const res =
          typeof dbParams[key] === 'string'
            ? `${key}='${dbParams[key]}'`
            : `${key}=${dbParams[key]}`
        return res
      })
      .join(' AND ')}`
  } else {
    sql = `SELECT * FROM ${tableName.toUpperCase()}`
  }

  logger.debug(sql)

  const db = new Database('data.db')
  const stmt = db.prepare(sql)
  stmt.run()
  const result = stmt.all()
  db.close()

  // 转换结果键名为驼峰风格
  if (Array.isArray(result)) {
    return result.map((item) => toCamelCase(item))
  }
  return toCamelCase(result)
}

export const insert = (
  tableName: string,
  params: Record<string, unknown>
): { lastInsertRowid: number; changes: number } => {
  // 转换参数键名为下划线风格
  const dbParams = toSnakeCase(params)

  const sql = `INSERT INTO ${tableName.toUpperCase()} (${Object.keys(dbParams).join(',')}) VALUES (${Object.keys(
    dbParams
  )
    .map((key) => {
      const value = dbParams[key]

      // 处理 null 值
      if (value === null || value === undefined) {
        return 'NULL'
      }

      // 处理字符串值
      if (typeof value === 'string') {
        return `'${value}'`
      }

      // 处理数字和其他值
      return value
    })
    .join(',')})`

  logger.debug(sql)

  return exec(sql)
}

export const update = (
  tableName: string,
  params: Record<string, unknown>,
  where: Record<string, unknown>
): { changes: number } => {
  // 转换参数键名为下划线风格
  const dbParams = toSnakeCase(params)
  const dbWhere = toSnakeCase(where)

  const sql = `UPDATE ${tableName.toUpperCase()} SET ${Object.keys(dbParams)
    .map((key) => {
      const value = dbParams[key]

      // 处理 null 值
      if (value === null || value === undefined) {
        return `${key}=NULL`
      }

      // 处理字符串值
      if (typeof value === 'string') {
        return `${key}='${value}'`
      }

      // 处理数字和其他值
      return `${key}=${value}`
    })
    .join(',')} WHERE ${Object.keys(dbWhere)
    .map((key) => {
      const value = dbWhere[key]

      // 处理 null 值
      if (value === null || value === undefined) {
        return `${key} IS NULL`
      }

      // 处理字符串值
      if (typeof value === 'string') {
        return `${key}='${value}'`
      }

      // 处理数字和其他值
      return `${key}=${value}`
    })
    .join(' AND ')}`

  logger.debug(sql)

  return exec(sql)
}

export const deleteRecord = (
  tableName: string,
  where: Record<string, unknown>
): { changes: number } => {
  // 转换参数键名为下划线风格
  const dbWhere = toSnakeCase(where)

  const sql = `DELETE FROM ${tableName.toUpperCase()} WHERE ${Object.keys(dbWhere)
    .map((key) => {
      const value = dbWhere[key]

      // 处理 null 值
      if (value === null || value === undefined) {
        return `${key} IS NULL`
      }

      // 处理字符串值
      if (typeof value === 'string') {
        return `${key}='${value}'`
      }

      // 处理数字和其他值
      return `${key}=${value}`
    })
    .join(' AND ')}`

  logger.debug(sql)

  return exec(sql)
}
