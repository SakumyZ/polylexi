import React from 'react'
import Button from '@/components/Button'

interface AddWordProps {
  onClick: (event: React.MouseEvent) => void
}

const AddWord: React.FC<AddWordProps> = ({ onClick }) => {
  return (
    <Button className="add-word-Button" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="24"
        height="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 6v6h-6v2h6v6h2v-6h6v-2h-6V6h-2z" />
      </svg>
    </Button>
  )
}

export default AddWord
