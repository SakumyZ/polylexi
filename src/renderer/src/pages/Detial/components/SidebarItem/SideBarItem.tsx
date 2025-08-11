import React from 'react'
import { WordOptions } from '@renderer/api/dictionary'
import './SidebarItem.css'

interface SideBarItemProps {
  selectedKey: string
  children?: React.ReactNode
  item: WordOptions
  onClick?: (wordId: string) => void
}

const SideBarItem: React.FC<SideBarItemProps> = ({ selectedKey, item, children, onClick }) => {
  const selectedClassName = selectedKey === item['word_id'].toString() ? 'selected' : ''

  return (
    <div
      className={`sidebar-item ${selectedClassName}`}
      onClick={() => {
        onClick?.(item['word_id'].toString())
      }}
    >
      {children}
    </div>
  )
}

export default SideBarItem
