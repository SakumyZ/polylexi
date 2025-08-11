import React, { useEffect, useState } from 'react'
import { WordOptions, getDictionaryDetial } from '@renderer/api/dictionary'
import { uuid } from '@renderer/utils/common'
import './WordSidebar.css'
import SideBarItem from '../SidebarItem/SideBarItem'
import TopNavBar from '../TopNavBar/TopNavBar'

interface WordSidebarProps {
  dictionaryId: string
  onClick: (worldId: string) => void
  onAddWord: () => void
  refreshTrigger?: string
  currentWordId?: string
}

const WordSidebar: React.FC<WordSidebarProps> = ({
  dictionaryId,
  onClick,
  onAddWord,
  refreshTrigger,
  currentWordId
}) => {
  const [wordList, setWordList] = useState<WordOptions[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string>('')

  /**
   * Fetch word details
   */
  const getDetail = (autoSelect = true) => {
    getDictionaryDetial(dictionaryId).then((res) => {
      setWordList(res)

      // 只有在需要自动选择时才选择第一个单词
      if (autoSelect && res.length > 0) {
        const firstWordId = res[0]?.['word_id']?.toString()
        if (firstWordId) {
          setSelectedItemId(firstWordId)
          onClick(firstWordId)
        }
      }
    })
  }

  useEffect(() => {
    getDetail()
  }, [dictionaryId])

  // 当currentWordId变化时，更新选中状态
  useEffect(() => {
    if (currentWordId) {
      setSelectedItemId(currentWordId)
    }
  }, [currentWordId])

  // 当refreshTrigger变化时，刷新列表并根据currentWordId设置选中状态
  useEffect(() => {
    if (refreshTrigger) {
      getDictionaryDetial(dictionaryId).then((res) => {
        setWordList(res)
        // 如果有currentWordId，设置为选中状态
        if (currentWordId) {
          setSelectedItemId(currentWordId)
        } else {
          setSelectedItemId('')
        }
      })
    }
  }, [refreshTrigger, currentWordId, dictionaryId])

  return (
    <div className="word-sidebar-wapper">
      <TopNavBar
        onAddWord={onAddWord}
        onSearch={(word) => {
          if (word) {
            getDictionaryDetial(dictionaryId, {
              word
            }).then((res) => {
              setWordList(res)
              // 搜索时清空选中状态，避免选中不存在的项目
              setSelectedItemId('')
            })
          } else {
            getDetail()
          }
        }}
      />
      <div className="sidebar-content">
        {wordList.map((item) => {
          return (
            <SideBarItem
              selectedKey={selectedItemId}
              key={uuid()}
              item={item}
              onClick={(wordId) => {
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
