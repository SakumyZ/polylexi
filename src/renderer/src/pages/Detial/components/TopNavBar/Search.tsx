import React from 'react'
import './Search.css'

interface SearchProps {
  onSearch: (word: string) => void
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = React.useState<string>('')

  return (
    <div className="top-search">
      <input
        className="search-text-field  full-width"
        type="text"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            onSearch(searchText)
          }
        }}
      />
    </div>
  )
}

export default Search
