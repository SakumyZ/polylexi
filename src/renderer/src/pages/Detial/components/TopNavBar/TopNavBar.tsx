import React from 'react'
import Search from './Search'
import AddWord from './AddWord'
import './TopNavBar.css'

interface TopNavBarProps {
  onAddWord: () => void
  onSearch: (word: string) => void
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onAddWord, onSearch }) => {
  return (
    <div className="top-nav-bar">
      <Search onSearch={onSearch} />
      <AddWord onClick={onAddWord} />
    </div>
  )
}

export default TopNavBar
