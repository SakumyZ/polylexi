import { ipcMain } from 'electron'
import logger from '@main/utils/logger'

// 处理来自渲染进程的错误日志
ipcMain.on(
  'log-error',
  (_, errorData: { message: string; stack?: string; componentStack?: string }) => {
    logger.error({
      msg: 'Renderer process error',
      error: errorData.message,
      stack: errorData.stack,
      componentStack: errorData.componentStack
    })
  }
)

ipcMain.on('log-info', (_, infoData: { message: string; data?: unknown }) => {
  logger.info({
    msg: 'Renderer process info',
    info: infoData.message,
    data: infoData.data
  })
})

ipcMain.on('log-warn', (_, warnData: { message: string; data?: unknown }) => {
  logger.warn({
    msg: 'Renderer process warning',
    warn: warnData.message,
    data: warnData.data
  })
})

ipcMain.on('log-debug', (_, debugData: { message: string; data?: unknown }) => {
  logger.debug({
    msg: 'Renderer process debug',
    debug: debugData.message,
    data: debugData.data
  })
})
