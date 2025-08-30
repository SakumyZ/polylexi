import pino from 'pino'
import { app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

// 获取日志文件路径
// dev 时放在项目目录，生产环境在用户数据目录
const logPath = is.dev ? join(process.cwd(), 'logs') : join(app.getPath('userData'), 'logs')
const logFile = join(logPath, 'app.log')

// 创建 pino 日志记录器
const logger = pino({
  level: 'debug',
  transport: {
    targets: [
      {
        level: 'debug',
        target: 'pino/file',
        options: {
          destination: logFile,
          mkdir: true
        }
      },
      {
        level: 'debug',
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          destination: 1 // 输出到 stdout (控制台)
        }
      }
    ]
  }
})

export default logger
