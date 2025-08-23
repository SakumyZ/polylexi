import React, { useContext } from 'react'
import { DialogContext } from '../components/Dialog/DialogProvider'

export interface DialogOptions {
  title?: string
  content?: string | React.ReactNode
  confirmText?: string
  cancelText?: string
}

export interface DialogMethods {
  confirm: (options: DialogOptions) => Promise<boolean>
  warning: (options: DialogOptions) => Promise<boolean>
  error: (options: DialogOptions) => Promise<void>
  alert: (options: DialogOptions) => Promise<void>
}

export const useDialog = () => {
  const context = useContext(DialogContext)

  if (context === undefined) {
    console.error('useDialog must be used within a DialogProvider')
    // 返回一个空的dialog对象以避免运行时错误
    return {
      confirm: () => Promise.resolve(false),
      warning: () => Promise.resolve(false),
      error: () => Promise.resolve(),
      alert: () => Promise.resolve()
    }
  }

  return context.dialog
}
