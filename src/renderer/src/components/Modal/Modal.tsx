import React from 'react'
import './Modal.css'
import Button from '../Button'

interface ModalProps {
  open: boolean
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  onOk?: (event: React.MouseEvent) => void
  onClose?: (event: React.MouseEvent) => void
}

const Modal: React.FC<ModalProps> = ({ open, title, children, actions, onOk, onClose }) => {
  return (
    <>
      {open && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{title}</h2>
              <span className="close" onClick={onClose}>
                &times;
              </span>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-actions">
              {actions ? (
                actions
              ) : (
                <>
                  <Button onClick={onClose}>取消</Button>
                  <Button htmlType="submit" primary onClick={onOk}>
                    确认
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
