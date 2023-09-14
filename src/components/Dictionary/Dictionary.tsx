import React from 'react'
import './Dictionary.css'
import MaterialSymbolsMoreHorizIcon from '../svgIcons/MaterialSymbolsMoreHoriz'
import MaterialSymbolsAddIcon from '../svgIcons/MaterialSymbolsAdd'

interface DictionaryProps {
  name?: string
  blank?: boolean
  onClick?: (event: React.MouseEvent) => void
}

const Dictionary: React.FC<DictionaryProps> = ({ name, blank, onClick }) => {
  const renderBlank = () => {
    return <MaterialSymbolsAddIcon className="dictionary-add" />
  }

  const renderDictionary = () => {
    return (
      <>
        <div className="dictionary-thumb"></div>
        <h2 className="dictionary-name">{name}</h2>
        <MaterialSymbolsMoreHorizIcon
          className="dictionary-settings"
          onClick={e => {
            e.stopPropagation()
          }}
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
