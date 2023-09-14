import React, { useEffect } from 'react'
import Dictionary from '@/components/Dictionary'
import CreateDictionaryModal from '@/popup/CreateDictionaryModal'
import { getDictionaryList, DictionaryOptions, addDictionary } from '@/api/dictionary'

interface HomeProps {
  onShowDetail: (dictionaryId: number) => void
}

export const Home: React.FC<HomeProps> = ({ onShowDetail }) => {
  const [dictionaryList, setDictionaryList] = React.useState<DictionaryOptions[]>([])

  const [openCreateModal, setOpenCreateModal] = React.useState(false)

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false)
  }

  useEffect(() => {
    // 获取词典列表
    getDictionaryList().then(res => {
      setDictionaryList(res)
    })
  }, [])

  return (
    <div className="dictionary-list-wrapper">
      {/* TODO 检索功能 */}

      <Dictionary
        blank
        onClick={() => {
          handleOpenCreateModal()
        }}
      />
      {dictionaryList.map(item => {
        return (
          <Dictionary
            key={item.id}
            name={item.name}
            onClick={() => {
              onShowDetail(item.id)
            }}
          />
        )
      })}

      <CreateDictionaryModal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={name => {
          addDictionary({ name }).then(() => {
            getDictionaryList().then(res => {
              setDictionaryList(res)
            })
          })
        }}
      />
    </div>
  )
}

export default Home
