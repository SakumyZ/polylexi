import React, { createContext, useState, useCallback } from 'react'
import Dialog from './Dialog'
import { DialogProps } from './Dialog'
import { DialogMethods, DialogOptions } from '@renderer/hooks/useDialog'

interface DialogContextType {
  dialog: DialogMethods
}

export const DialogContext = createContext<DialogContextType | null>(null)

interface DialogProviderProps {
  children: React.ReactNode
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogProps>({
    open: false,
    title: '',
    content: '',
    type: 'confirm',
    showCancel: true,
    confirmText: '确定',
    cancelText: '取消'
  })

  const showDialog = useCallback((options: DialogOptions & { type: DialogProps['type']; showCancel?: boolean }): Promise<any> => {
    return new Promise((resolve) => {
      const handleConfirm = () => {
        console.log('Dialog confirm clicked')
        setDialogState(prev => ({ ...prev, open: false }))
        resolve(true)
      }

      const handleCancel = () => {
        console.log('Dialog cancel clicked')
        setDialogState(prev => ({ ...prev, open: false }))
        resolve(false)
      }

      console.log('Showing dialog with options:', options)
      setDialogState({
        ...options,
        open: true,
        showCancel: options.showCancel !== undefined ? options.showCancel : true,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        onConfirm: handleConfirm,
        onCancel: handleCancel,
        onClose: handleCancel
      })
    })
  }, [])

  const dialog: DialogMethods = {
    confirm: (options: DialogOptions) => {
      console.log('Dialog confirm method called with options:', options)
      return showDialog({ ...options, type: 'confirm' })
    },
    warning: (options: DialogOptions) => showDialog({ ...options, type: 'warning' }),
    error: (options: DialogOptions) => showDialog({ ...options, type: 'error', showCancel: false }),
    alert: (options: DialogOptions) => showDialog({ ...options, type: 'alert', showCancel: false })
  }

  console.log('DialogProvider rendering with dialog object:', dialog)

  return (
    <DialogContext.Provider value={{ dialog }}>
      {children}
      <Dialog {...dialogState} />
    </DialogContext.Provider>
  )
}