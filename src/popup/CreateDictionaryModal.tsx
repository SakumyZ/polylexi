import React, { useState } from 'react'
import Modal from '../components/Modal'

interface CreateDictionaryModalProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

const CreateDictionaryModal: React.FC<CreateDictionaryModalProps> = ({
  open,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('')

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleCreate = () => {
    onCreate(name)
    setName('')
    onClose()
  }

  return (
    <Modal title="新建词典" open={open} onOk={handleCreate} onClose={onClose}>
      <div>
        <label htmlFor="name">词典名:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
      </div>
    </Modal>
  )
}

export default CreateDictionaryModal
