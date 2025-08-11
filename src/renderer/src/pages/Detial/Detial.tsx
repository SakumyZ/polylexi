import React, { useState } from 'react'
import { WordOptions } from '@renderer/api/dictionary'
import { getWordDetial, deleteWord } from '@renderer/api/word'
import WordSidebar from './components/WordSidebar/WordSidebar'
import './Detail.css'
import WordContent from './components/WordContent/WordContent'
import WordContentEdit from './components/WordContentEdit/WordContentEdit'
import { uuid } from '@renderer/utils/common'
import Button from '@renderer/components/Button'
// import { left } from '@popperjs/core'

interface DetialProps {
  dictionaryId: number
  onCancelHome: () => void
}

const Detial: React.FC<DetialProps> = ({ dictionaryId, onCancelHome }) => {
  const [wordDetial, setWordDetail] = useState<WordOptions[]>([])
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true)
  const [isEidt, setIsEidt] = useState<boolean>(false)
  const [wordId, setWordId] = useState<string>('')
  const [refreshTrigger, setRefreshTrigger] = useState<string>('')

  const handleDeleteWord = async () => {
    if (!wordId) {
      alert('请先选择一个单词')
      return
    }

    const confirmDelete = window.confirm(
      '确定要删除这个单词吗？删除后将无法恢复，该单词的所有语言版本都会被删除。'
    )

    if (confirmDelete) {
      try {
        await deleteWord(dictionaryId.toString(), wordId)
        alert('单词删除成功')
        // 清空当前显示的单词详情
        setWordDetail([])
        setWordId('')
        // 刷新侧边栏 - 通过设置新的 refreshTrigger 来触发 WordSidebar 重新加载
        setRefreshTrigger(uuid())
      } catch (error) {
        console.error('删除单词失败:', error)
        alert('删除单词失败，请稍后重试。')
      }
    }
  }

  return (
    <div className="detial-wapper">
      <WordSidebar
        refreshTrigger={refreshTrigger}
        currentWordId={wordId}
        dictionaryId={dictionaryId.toString()}
        onClick={(clickedWordId) => {
          setIsReadOnly(true)
          setWordId(clickedWordId)
          getWordDetial(dictionaryId.toString(), clickedWordId.toString()).then((res) => {
            setWordDetail(res)
          })
        }}
        onAddWord={() => {
          setIsReadOnly(false)
          setIsEidt(false)
        }}
      />

      <div className="main-content">
        <div className="top-control">
          <div
            style={{
              position: 'absolute',
              left: '2rem'
            }}
          >
            <Button
              onClick={() => {
                onCancelHome()
              }}
            >
              返回
            </Button>
          </div>
          <Button
            onClick={() => {
              setIsReadOnly(true)
              setIsEidt(false)
            }}
          >
            查看
          </Button>
          <Button
            onClick={() => {
              setIsEidt(true)
              setIsReadOnly(false)
            }}
          >
            编辑
          </Button>
          {isReadOnly && wordId && (
            <Button onClick={handleDeleteWord} color="danger">
              删除
            </Button>
          )}
        </div>

        <div className="content-area">
          {isReadOnly ? (
            <WordContent data={wordDetial} />
          ) : (
            <WordContentEdit
              isEdit={isEidt}
              data={wordDetial}
              dictionaryId={dictionaryId.toString()}
              onAfterAdd={(addedWordId) => {
                // 设置新添加的单词ID
                setWordId(addedWordId)
                // 刷新侧边栏
                setRefreshTrigger(uuid())
                // 切换到查看模式
                setIsReadOnly(true)
                setIsEidt(false)
                // 获取新添加单词的详情
                getWordDetial(dictionaryId.toString(), addedWordId).then((res) => {
                  setWordDetail(res)
                })
              }}
              onAfterEdit={() => {
                // 编辑完成后刷新当前单词详情
                if (wordId) {
                  getWordDetial(dictionaryId.toString(), wordId).then((res) => {
                    setWordDetail(res)
                  })
                }
                // 切换到查看模式
                setIsReadOnly(true)
                setIsEidt(false)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Detial
