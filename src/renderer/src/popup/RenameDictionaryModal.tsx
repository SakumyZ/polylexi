import React, { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import './CreateDictionaryModal.css'

interface RenameDictionaryModalProps {
  open: boolean
  onClose: () => void
  onRename: (newName: string) => void
  currentName: string
}

const RenameDictionaryModal: React.FC<RenameDictionaryModalProps> = ({
  open,
  onClose,
  onRename,
  currentName
}) => {
  const [name, setName] = useState('')

  useEffect(() => {
    if (open && currentName) {
      setName(currentName)
    }
  }, [open, currentName])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleRename = () => {
    if (name.trim() === '') {
      alert('词典名称不能为空')
      return
    }

    if (name.trim() === currentName) {
      alert('新名称与当前名称相同')
      return
    }

    onRename(name.trim())
    handleClose()
  }

  const handleClose = () => {
    setName(currentName)
    onClose()
  }

  return (
    <Modal title="重命名词典" open={open} onOk={handleRename} onClose={handleClose}>
      <div className="create-dictionary-modal">
        <div className="create-dictionary-form">
          <div className="form-field">
            <label htmlFor="rename-input" className="field-label">
              词典名称
            </label>
            <input
              type="text"
              id="rename-input"
              value={name}
              onChange={handleNameChange}
              placeholder="请输入新的词典名称"
              className="form-input"
              autoFocus
              maxLength={50}
            />
            <p className="upload-hint">当前名称：{currentName}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default RenameDictionaryModal
