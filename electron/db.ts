// eslint-disable-next-line
const Database = require('better-sqlite3')

/**
 * 初始化数据库
 */
export const initDB = () => {
  const db = new Database('data.db')

  db.exec(`
    CREATE TABLE IF NOT EXISTS dictionary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cover BLOB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      lang TEXT NOT NULL
    )
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
      FOREIGN KEY (language_id) REFERENCES languages(id)
      FOREIGN KEY (dictionary_id) REFERENCES dictionary(id)
    )
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

export const select = (tableName: string, params?: Record<string, any>) => {
  let sql = ''

  if (params) {
    sql = `SELECT * FROM ${tableName} WHERE ${Object.keys(params)
      .map(key => {
        const res =
          typeof params[key] === 'string' ? `${key}='${params[key]}'` : `${key}=${params[key]}`
        return res
      })
      .join(' AND ')}`
  } else {
    sql = `SELECT * FROM ${tableName}`
  }

  console.log(sql)

  const db = new Database('data.db')
  const stmt = db.prepare(sql)
  stmt.run()
  const result = stmt.all()
  db.close()

  return result
}

export const insert = (tableName: string, params?: any) => {
  const sql = `INSERT INTO ${tableName} (${Object.keys(params).join(',')}) VALUES (${Object.keys(
    params
  )
    .map(key => {
      const value = typeof params[key] === 'string' ? `'${params[key]}'` : params[key]

      return value
    })
    .join(',')})`

  return exec(sql)
}

export const update = (tableName: string, params?: any, where?: any) => {
  const sql = `UPDATE ${tableName} SET ${Object.keys(params)
    .map(key => {
      const value = typeof params[key] === 'string' ? `'${params[key]}'` : params[key]

      return `${key}=${value}`
    })
    .join(',')} WHERE ${Object.keys(where)
    .map(key => {
      const value = typeof where[key] === 'string' ? `'${where[key]}'` : where[key]

      return `${key}=${value}`
    })
    .join(' AND ')}`

  console.log(sql)

  return exec(sql)
}
