const { ipcRenderer } = window.electron

interface ErrorData {
  message: string
  stack?: string
  componentStack?: string
}

interface LogData {
  message: string
  data?: unknown
}

/**
 * 发送错误日志到主进程
 * @param error 错误对象或错误消息
 */
export const logError = (error: Error | string): void => {
  const errorData: ErrorData =
    typeof error === 'string'
      ? { message: error }
      : {
          message: error.message,
          stack: error.stack
        }

  ipcRenderer.send('log-error', errorData)
}

/**
 * 发送信息日志到主进程
 * @param message 日志消息
 * @param data 附加数据
 */
export const logInfo = (message: string, data?: unknown): void => {
  const logData: LogData = { message, data }
  ipcRenderer.send('log-info', logData)
}

/**
 * 发送警告日志到主进程
 * @param message 警告消息
 * @param data 附加数据
 */
export const logWarning = (message: string, data?: unknown): void => {
  const logData: LogData = { message, data }
  ipcRenderer.send('log-warn', logData)
}

/**
 * 发送调试日志到主进程
 * @param message 调试消息
 * @param data 附加数据
 */
export const logDebug = (message: string, data?: unknown): void => {
  const logData: LogData = { message, data }
  ipcRenderer.send('log-debug', logData)
}
