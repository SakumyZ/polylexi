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
  const selectedClassName = selectedKey === (item.wordId?.toString() || '') ? 'selected' : ''

  return (
    <div
      className={`sidebar-item ${selectedClassName}`}
      onClick={() => {
        onClick?.(item.wordId?.toString() || '')
      }}
    >
      {children}
    </div>
  )
}

export default SideBarItem
