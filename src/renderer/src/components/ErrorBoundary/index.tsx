import React, { ErrorInfo, ReactNode } from 'react'
import { logError } from '../../utils/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // 更新 state 使下一次渲染可以显示降级 UI
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    // 发送错误到主进程，包括组件堆栈信息
    const enhancedError = new Error(error.message)
    enhancedError.stack = `${error.stack}\nComponent stack:\n${errorInfo.componentStack}`
    logError(enhancedError)
  }

  public render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义的降级 UI
      return this.props.fallback || <h1>Sorry.. there was an error</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary
