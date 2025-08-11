import React from 'react'
import './Dictionary.css'
import MaterialSymbolsMoreHorizIcon from '../svgIcons/MaterialSymbolsMoreHoriz'
import MaterialSymbolsAddIcon from '../svgIcons/MaterialSymbolsAdd'
import MaterialSymbolsDeleteIcon from '../svgIcons/MaterialSymbolsDelete'
import MaterialSymbolsEdit from '../svgIcons/MaterialSymbolsEdit'
import DropdownMenu from '../DropdownMenu'

interface DictionaryProps {
  id?: number
  name?: string
  cover?: string | null
  blank?: boolean
  onClick?: (event: React.MouseEvent) => void
  onDelete?: (id: number) => void
  onEditCover?: (id: number, name: string, currentCover?: string | null) => void
  onRename?: (id: number, currentName: string) => void
}

const Dictionary: React.FC<DictionaryProps> = ({
  id,
  name,
  cover,
  blank,
  onClick,
  onDelete,
  onEditCover,
  onRename
}) => {
  // 根据词典ID或名称生成渐变样式类名
  const getGradientClass = () => {
    if (!id && !name) return 'gradient-1'

    // 使用ID或名称的哈希值来确定渐变样式
    const seed = id || name?.charCodeAt(0) || 1
    const gradientIndex = (seed % 10) + 1
    return `gradient-${gradientIndex}`
  }

  const renderBlank = () => {
    return <MaterialSymbolsAddIcon className="dictionary-add" />
  }

  const renderDictionary = () => {
    const menuItems = [
      {
        label: '重命名',
        icon: <MaterialSymbolsEdit />,
        onClick: () => {
          if (id && name && onRename) {
            onRename(id, name)
          }
        }
      },
      {
        label: '修改封面',
        icon: <MaterialSymbolsEdit />,
        onClick: () => {
          if (id && name && onEditCover) {
            onEditCover(id, name, cover)
          }
        }
      },
      {
        label: '删除',
        icon: <MaterialSymbolsDeleteIcon />,
        onClick: () => {
          if (id && onDelete) {
            onDelete(id)
          }
        },
        danger: true
      },
      {
        label: '导出',
        onClick: () => {
          console.log('导出词典:', id)
        }
      }
    ]

    return (
      <>
        <div className="dictionary-thumb">
          {cover ? (
            <img src={cover} alt={`${name} 封面`} className="dictionary-cover" />
          ) : (
            <div className={`dictionary-placeholder ${getGradientClass()}`}></div>
          )}
        </div>
        <h2 className="dictionary-name">{name}</h2>
        <DropdownMenu
          trigger={<MaterialSymbolsMoreHorizIcon className="dictionary-settings" />}
          items={menuItems}
          className="dictionary-menu"
        />
      </>
    )
  }

  return (
    <div className="dictionary-root" onClick={onClick}>
      {blank ? renderBlank() : renderDictionary()}
    </div>
  )
}

export default Dictionary
