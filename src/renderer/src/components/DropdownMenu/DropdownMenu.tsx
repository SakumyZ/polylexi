import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './DropdownMenu.css'

interface MenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  danger?: boolean
}

interface DropdownMenuProps {
  trigger: React.ReactNode
  items: MenuItem[]
  className?: string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, items, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => {
      if (isOpen) {
        updatePosition()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isOpen])

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const menuWidth = 160 // 预估菜单宽度
      const menuHeight = items.length * 56 + 16 // 预估菜单高度

      let top = rect.bottom + 4
      let left = rect.right - menuWidth

      // 检查是否超出视窗底部
      if (top + menuHeight > window.innerHeight) {
        top = rect.top - menuHeight - 4
      }

      // 检查是否超出视窗左侧
      if (left < 8) {
        left = 8
      }

      // 检查是否超出视窗右侧
      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8
      }

      setPosition({ top, left })
    }
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOpen) {
      updatePosition()
    }
    setIsOpen(!isOpen)
  }

  const handleItemClick = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation()
    item.onClick()
    setIsOpen(false)
  }

  const dropdownContent = isOpen ? (
    <div
      ref={contentRef}
      className="dropdown-content-portal"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 9999
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={`dropdown-item ${item.danger ? 'danger' : ''}`}
          onClick={(e) => handleItemClick(e, item)}
        >
          {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
          <span className="dropdown-item-label">{item.label}</span>
        </div>
      ))}
    </div>
  ) : null

  return (
    <>
      <div className={`dropdown-menu ${className || ''}`} ref={triggerRef}>
        <div className="dropdown-trigger" onClick={handleTriggerClick}>
          {trigger}
        </div>
      </div>
      {typeof document !== 'undefined' &&
        dropdownContent &&
        createPortal(dropdownContent, document.body)}
    </>
  )
}

export default DropdownMenu
