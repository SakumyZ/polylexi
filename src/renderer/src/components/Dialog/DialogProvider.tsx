import React, { createContext, useContext, ReactNode } from 'react'
import Dialog from './Dialog'
import { useDialog } from '@renderer/hooks/useDialog'
import { DialogProps } from './Dialog'
import { DialogMethods } from '@renderer/hooks/useDialog'

interface DialogContextType {
  dialog: DialogMethods
  dialogProps: DialogProps
  updateDialogProps: (props: Partial<DialogProps>) => void
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined)

interface DialogProviderProps {
  children: ReactNode
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const { dialog, dialogProps, updateDialogProps } = useDialog()

  return (
    <DialogContext.Provider value={{ dialog, dialogProps, updateDialogProps }}>
      {children}
      <Dialog {...dialogProps} />
    </DialogContext.Provider>
  )
}

export const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (context === undefined) {
    throw new Error('useDialogContext must be used within a DialogProvider')
  }
  return context
}