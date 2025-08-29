import { useEffect, useState } from 'react'
import Flag from '@renderer/components/Flag/Flag'
import { type WordMap, addWord, updateWord } from '@renderer/api/word'
import './WordContentEdit.css'
import Button from '@renderer/components/Button'
import { WordOptions } from '@renderer/api/dictionary'

interface WordContentEditProps {
  dictionaryId: string
  data?: WordOptions[]
  isEdit?: boolean
  onAfterEdit: () => void
  onAfterAdd: (wordId: string) => void
}

const WordContentEdit: React.FC<WordContentEditProps> = ({
  dictionaryId,
  data,
  isEdit,
  onAfterAdd,
  onAfterEdit
}) => {
  const langsOptions: WordOptions[] = [
    { id: 1, lang: 'zh-CN', word: '', wordId: 0 },
    { id: 2, lang: 'en-US', word: '', wordId: 0 },
    { id: 3, lang: 'ja-JP', word: '', wordId: 0 }
  ]
  const [wordMap, setWordMap] = useState<WordMap>({})

  useEffect(() => {
    if (data && isEdit) {
      const newWordMap: WordMap = {}
      data.forEach((item) => {
        newWordMap[item.lang] = {
          id: item.id,
          word: item.word
        }
      })
      setWordMap(newWordMap)
    }
  }, [data, isEdit])

  const finalMap: WordOptions[] = data?.length ? data : langsOptions

  return (
    <div className="word-content-wrapper">
      {finalMap.map((langOption) => {
        return (
          <div className="content-item" key={langOption.id}>
            <Flag lang={langOption.lang} />
            <input
              type="text"
              value={wordMap[langOption.lang]?.word || ''}
              onChange={(e) => {
                setWordMap({
                  ...wordMap,
                  [langOption.lang]: {
                    id: langOption.id,
                    word: e.target.value
                  }
                })
              }}
            />
          </div>
        )
      })}

      <Button
        onClick={() => {
          // edit mode
          if (isEdit) {
            updateWord(dictionaryId, wordMap).then(() => {
              onAfterEdit()
            })
          } else {
            // create mode
            addWord(dictionaryId, wordMap).then((wordId) => {
              onAfterAdd(wordId)
            })
          }
        }}
      >
        保存
      </Button>
    </div>
  )
}

export default WordContentEdit
