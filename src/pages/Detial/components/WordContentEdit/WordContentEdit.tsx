import { useEffect, useState } from 'react'
import Flag from '@/components/Flag/Flag'
import { type WordMap, addWord, updateWord } from '@/api/word'
import './WordContentEdit.css'
import Button from '@/components/Button'

interface WordContentEditProps {
  dictionaryId: string
  data?: any[]
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
  const langsOptions: any[] = [
    { id: 1, lang: 'zh-CN' },
    { id: 2, lang: 'en-US' },
    { id: 3, lang: 'ja-JP' }
  ]
  const [wordMap, setWordMap] = useState<WordMap>({})

  useEffect(() => {
    if (data && isEdit) {
      const newWordMap: WordMap = {}
      data.forEach(item => {
        newWordMap[item.lang] = {
          id: item.id,
          word: item.word
        }
      })
      setWordMap(newWordMap)
    }
  }, [data, isEdit])

  const finalMap: any[] = data ? data : langsOptions

  return (
    <div className="word-content-wrapper">
      {finalMap.map(langOption => {
        return (
          <div className="content-item" key={langOption.id}>
            <Flag lang={langOption.lang} />
            <input
              type="text"
              value={wordMap[langOption.lang]?.word || ''}
              onChange={e => {
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
          if (isEdit) {
            updateWord(dictionaryId, wordMap).then(() => {
              onAfterEdit()
            })
          } else {
            addWord(dictionaryId, wordMap).then(wordId => {
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
