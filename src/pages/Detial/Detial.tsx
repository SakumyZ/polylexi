import React, { useState } from 'react'
import { WordOptions } from '@/api/dictionary'
import { getWordDetial } from '@/api/word'
import WordSidebar from './components/WordSidebar/WordSidebar'
import './Detail.css'
import WordContent from './components/WordContent/WordContent'
import WordContentEdit from './components/WordContentEdit/WordContentEdit'
import { uuid } from '@/utils/common'
import Button from '@/components/Button'
import { left } from '@popperjs/core'

interface DetialProps {
  dictionaryId: number
  onCancelHome: () => void
}

const Detial: React.FC<DetialProps> = ({ dictionaryId, onCancelHome }) => {
  const [wordDetial, setWordDetail] = useState<WordOptions[]>([])
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true)
  const [isEidt, setIsEidt] = useState<boolean>(false)
  const [wordId, setWordId] = useState<string>('')

  return (
    <div className="detial-wapper">
      <WordSidebar
        wordId={wordId}
        dictionaryId={dictionaryId.toString()}
        onClick={wordId => {
          setIsReadOnly(true)
          getWordDetial(dictionaryId.toString(), wordId.toString()).then(res => {
            setWordDetail(res)
          })
        }}
        onAddWord={() => {
          setIsReadOnly(false)
          setIsEidt(false)
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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
        </div>

        {isReadOnly ? (
          <WordContent data={wordDetial} />
        ) : (
          <WordContentEdit
            isEdit={isEidt}
            data={wordDetial}
            dictionaryId={dictionaryId.toString()}
            onAfterAdd={addedWordId => {
              setWordId(addedWordId)
            }}
            onAfterEdit={() => {
              setWordId(uuid())
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Detial
