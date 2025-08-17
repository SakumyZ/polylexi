import React, { useState, useCallback, useContext } from 'react'
import { DialogProps } from '../components/Dialog/Dialog'
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

export interface UseDialogReturn {
  dialog: DialogMethods
  dialogProps?: DialogProps
  updateDialogProps?: (props: Partial<DialogProps>) => void
  DialogComponent?: React.FC
}

export const useDialog = () => {
  // 尝试使用context模式
  const context = useContext(DialogContext)
  
  // 如果在Provider中使用，返回context中的dialog
  if (context) {
    const { dialog, dialogProps, updateDialogProps } = context
    return {
      dialog,
      dialogProps,
      updateDialogProps
    }
  }

  // 否则使用独立模式
  const [dialogState, setDialogState] = useState<DialogProps>({
    open: false,
    title: '',
    content: '',
    type: 'confirm',
    showCancel: true,
    confirmText: '确定',
    cancelText: '取消'
  })

  const [resolvePromise, setResolvePromise] = useState<{
    resolve: (value: boolean | void) => void
  } | null>(null)

  const hideDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }))
  }, [])

  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise.resolve(true)
      setResolvePromise(null)
    }
    hideDialog()
  }, [resolvePromise, hideDialog])

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise.resolve(false)
      setResolvePromise(null)
    }
    hideDialog()
  }, [resolvePromise, hideDialog])

  const confirm = useCallback(
    (options: DialogOptions): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        setResolvePromise({ resolve: resolve as (value: boolean | void) => void })
        setDialogState({
          ...options,
          open: true,
          type: 'confirm',
          showCancel: true,
          confirmText: options.confirmText || '确定',
          cancelText: options.cancelText || '取消',
          onConfirm: handleConfirm,
          onCancel: handleCancel,
          onClose: handleCancel
        })
      })
    },
    [handleConfirm, handleCancel]
  )

  const warning = useCallback(
    (options: DialogOptions): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        setResolvePromise({ resolve: resolve as (value: boolean | void) => void })
        setDialogState({
          ...options,
          open: true,
          type: 'warning',
          showCancel: true,
          confirmText: options.confirmText || '确定',
          cancelText: options.cancelText || '取消',
          onConfirm: handleConfirm,
          onCancel: handleCancel,
          onClose: handleCancel
        })
      })
    },
    [handleConfirm, handleCancel]
  )

  const error = useCallback(
    (options: DialogOptions): Promise<void> => {
      return new Promise<void>((resolve) => {
        setResolvePromise({ resolve: resolve as (value: boolean | void) => void })
        setDialogState({
          ...options,
          open: true,
          type: 'error',
          showCancel: false,
          confirmText: options.confirmText || '确定',
          onConfirm: () => {
            resolve()
            hideDialog()
          },
          onClose: () => {
            resolve()
            hideDialog()
          }
        })
      })
    },
    [hideDialog]
  )

  const alert = useCallback(
    (options: DialogOptions): Promise<void> => {
      return new Promise<void>((resolve) => {
        setResolvePromise({ resolve: resolve as (value: boolean | void) => void })
        setDialogState({
          ...options,
          open: true,
          type: 'alert',
          showCancel: false,
          confirmText: options.confirmText || '确定',
          onConfirm: () => {
            resolve()
            hideDialog()
          },
          onClose: () => {
            resolve()
            hideDialog()
          }
        })
      })
    },
    [hideDialog]
  )

  const dialogMethods: DialogMethods = {
    confirm,
    warning,
    error,
    alert
  }

  const updateDialogProps = useCallback((props: Partial<DialogProps>) => {
    setDialogState(prev => ({ ...prev, ...props }))
  }, [])

  // Dialog组件
  const DialogComponent = useCallback(() => {
    return React.createElement('div', {}, React.createElement('div', { style: { display: 'none' } }))
  }, [])

  return {
    dialog: dialogMethods,
    dialogProps: dialogState,
    updateDialogProps,
    DialogComponent
  }
}
