import React, { useEffect, useState } from 'react'
import { WordOptions, getDictionaryDetial } from '@/api/dictionary'
import { uuid } from '@/utils/common'
import './WordSidebar.css'
import SideBarItem from '../SidebarItem/SideBarItem'
import TopNavBar from '../TopNavBar/TopNavBar'

interface WordSidebarProps {
  dictionaryId: string
  wordId: string
  onClick: (worldId: string) => void
  onAddWord: () => void
}

const WordSidebar: React.FC<WordSidebarProps> = ({ dictionaryId, wordId, onClick, onAddWord }) => {
  const [wordList, setWordList] = useState<WordOptions[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string>('')

  const getDetail = () => {
    getDictionaryDetial(dictionaryId).then(res => {
      setWordList(res)
      setSelectedItemId(res[0]?.['word_id'].toString())
      onClick(res[0]?.['word_id'].toString())
    })
  }

  useEffect(() => {
    getDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordId])

  return (
    <div className="word-sidebar-wapper">
      <TopNavBar
        onAddWord={onAddWord}
        onSearch={word => {
          if (word) {
            getDictionaryDetial(dictionaryId, {
              word
            }).then(res => {
              setWordList(res)
            })
          } else {
            getDetail()
          }
        }}
      />
      <div className="sidebar-content">
        {wordList.map(item => {
          return (
            <SideBarItem
              selectedKey={selectedItemId}
              key={uuid()}
              item={item}
              onClick={wordId => {
                setSelectedItemId(wordId.toString())
                onClick(wordId)
              }}
            >
              {item.word}
            </SideBarItem>
          )
        })}
      </div>
    </div>
  )
}

export default WordSidebar
