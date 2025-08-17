import React from 'react'
import './Dialog.css'
import Button from '../Button'

export interface DialogProps {
  open: boolean
  title?: string
  content?: string | React.ReactNode
  type?: 'confirm' | 'warning' | 'error' | 'alert' | 'custom'
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}

const Dialog: React.FC<DialogProps> = ({
  open,
  title = '提示',
  content,
  type = 'confirm',
  showCancel = true,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  onClose
}) => {
  if (!open) return null

  const handleConfirm = () => {
    onConfirm?.()
    onClose?.()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose?.()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  return (
    <div className="dialog-overlay" onClick={handleBackdropClick}>
      <div className="dialog-content">
        <div className="dialog-header">
          <h3 className="dialog-title">
            <div className={`dialog-icon dialog-icon-${type}`}></div>
            <span>{title}</span>
          </h3>
        </div>

        <div className="dialog-body">
          {typeof content === 'string' ? <p className="dialog-text">{content}</p> : content}
        </div>

        <div className="dialog-actions">
          {showCancel && (
            <Button className="dialog-cancel-btn" onClick={handleCancel}>
              {cancelText}
            </Button>
          )}
          <Button className="dialog-confirm-btn" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dialog
