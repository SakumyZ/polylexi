import path from 'path'
import fs from 'fs-extra'
import { v4 as uuidv4 } from 'uuid'
import { app } from 'electron'

export class FileManager {
  private static coversDir: string
  private static initialized = false

  static async init(): Promise<void> {
    try {
      console.log('FileManager.init() called')

      // 在开发环境中使用项目根目录，在生产环境中使用用户数据目录
      const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

      console.log('FileManager: isDev =', isDev)
      console.log('FileManager: process.cwd() =', process.cwd())

      if (isDev) {
        // 开发环境：使用项目根目录
        this.coversDir = path.join(process.cwd(), 'resources', 'covers')
      } else {
        // 生产环境：使用用户数据目录
        const userDataPath = app.getPath('userData')
        this.coversDir = path.join(userDataPath, 'covers')
      }

      console.log('FileManager: Using covers directory:', this.coversDir)

      // 使用 fs-extra 的 ensureDir 自动创建目录
      await fs.ensureDir(this.coversDir)

      this.initialized = true
      console.log('FileManager: Initialization completed successfully')
    } catch (error) {
      console.error('FileManager.init() failed:', error)
      throw error
    }
  }

  private static async ensureInitialized(): Promise<void> {
    if (!this.initialized || !this.coversDir) {
      console.log('FileManager: Auto-initializing...')
      await this.init()
    }
  }

  static async saveImage(base64Data: string): Promise<string> {
    try {
      // 确保已初始化
      await this.ensureInitialized()

      console.log('FileManager.saveImage called with coversDir:', this.coversDir)

      // 从 base64 中提取文件类型
      const matches = base64Data.match(/^data:image\/([a-zA-Z]*);base64,(.*)$/)
      if (!matches) {
        throw new Error('Invalid base64 image data')
      }

      const fileExtension = matches[1] === 'jpeg' ? 'jpg' : matches[1]
      const imageData = matches[2]

      // 生成唯一文件名
      const fileName = `${uuidv4()}.${fileExtension}`
      const filePath = path.join(this.coversDir, fileName)

      console.log('FileManager: Saving image to:', filePath)

      // 使用 fs-extra 保存文件
      await fs.writeFile(filePath, imageData, 'base64')

      console.log('FileManager: Image saved successfully as:', fileName)
      return fileName
    } catch (error) {
      console.error('Save image failed:', error)
      throw error
    }
  }

  static getImagePath(fileName: string): string {
    return path.join(this.coversDir, fileName)
  }

  static async getImageUrl(fileName: string): Promise<string> {
    try {
      await this.ensureInitialized()
      const filePath = this.getImagePath(fileName)

      // 使用 fs-extra 检查文件是否存在
      if (await fs.pathExists(filePath)) {
        // 读取文件并转换为base64
        const buffer = await fs.readFile(filePath)
        const base64 = buffer.toString('base64')

        // 根据文件扩展名确定MIME类型
        const ext = path.extname(fileName).toLowerCase()
        let mimeType = 'image/png' // 默认

        if (ext === '.jpg' || ext === '.jpeg') {
          mimeType = 'image/jpeg'
        } else if (ext === '.png') {
          mimeType = 'image/png'
        } else if (ext === '.gif') {
          mimeType = 'image/gif'
        } else if (ext === '.webp') {
          mimeType = 'image/webp'
        }

        return `data:${mimeType};base64,${base64}`
      }
      return ''
    } catch (error) {
      console.error('Get image URL failed:', error)
      return ''
    }
  }

  static async deleteImage(fileName: string): Promise<boolean> {
    try {
      await this.ensureInitialized()
      const filePath = this.getImagePath(fileName)

      // 使用 fs-extra 的 remove 方法，如果文件不存在也不会报错
      await fs.remove(filePath)
      console.log('FileManager: Image deleted successfully:', fileName)
      return true
    } catch (error) {
      console.error('Delete image failed:', error)
      return false
    }
  }

  static async updateImage(oldFileName: string | null, newBase64Data: string): Promise<string> {
    // 删除旧文件
    if (oldFileName) {
      this.deleteImage(oldFileName)
    }

    // 保存新文件
    return await this.saveImage(newBase64Data)
  }
}
