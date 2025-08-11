import React, { useEffect } from 'react'
import Dictionary from '@renderer/components/Dictionary'
import CreateDictionaryModal from '@renderer/popup/CreateDictionaryModal'
import EditCoverModal from '@renderer/popup/EditCoverModal'
import RenameDictionaryModal from '@renderer/popup/RenameDictionaryModal'
import {
  getDictionaryList,
  DictionaryOptions,
  addDictionary,
  deleteDictionary,
  updateDictionary
} from '@renderer/api/dictionary'

interface HomeProps {
  onShowDetail: (dictionaryId: number) => void
}

export const Home: React.FC<HomeProps> = ({ onShowDetail }) => {
  const [dictionaryList, setDictionaryList] = React.useState<DictionaryOptions[]>([])
  const [openCreateModal, setOpenCreateModal] = React.useState(false)
  const [editCoverModal, setEditCoverModal] = React.useState<{
    open: boolean
    dictionaryId: number | null
    dictionaryName: string
    currentCover: string | null
  }>({
    open: false,
    dictionaryId: null,
    dictionaryName: '',
    currentCover: null
  })

  const [renameModal, setRenameModal] = React.useState<{
    open: boolean
    dictionaryId: number | null
    currentName: string
  }>({
    open: false,
    dictionaryId: null,
    currentName: ''
  })

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false)
  }

  const handleEditCover = (id: number, name: string, currentCover?: string | null) => {
    setEditCoverModal({
      open: true,
      dictionaryId: id,
      dictionaryName: name,
      currentCover: currentCover || null
    })
  }

  const handleCloseEditCover = () => {
    setEditCoverModal({
      open: false,
      dictionaryId: null,
      dictionaryName: '',
      currentCover: null
    })
  }

  const handleRename = (id: number, currentName: string) => {
    setRenameModal({
      open: true,
      dictionaryId: id,
      currentName
    })
  }

  const handleCloseRename = () => {
    setRenameModal({
      open: false,
      dictionaryId: null,
      currentName: ''
    })
  }

  const handleSaveRename = async (newName: string) => {
    if (renameModal.dictionaryId) {
      try {
        await updateDictionary(renameModal.dictionaryId, { name: newName })
        // 重新获取词典列表
        await refreshDictionaryList()
      } catch (error) {
        console.error('重命名词典失败:', error)
        alert('重命名词典失败，请稍后重试。')
      }
    }
  }

  const handleSaveCover = async (cover: string | null) => {
    if (editCoverModal.dictionaryId) {
      try {
        await updateDictionary(editCoverModal.dictionaryId, { cover })
        // 重新获取词典列表
        await refreshDictionaryList()
      } catch (error) {
        console.error('更新封面失败:', error)
        alert('更新封面失败，请稍后重试。')
      }
    }
  }

  const handleDeleteDictionary = async (id: number) => {
    const confirmDelete = window.confirm('确定要删除这个词典吗？删除后将无法恢复。')

    if (confirmDelete) {
      try {
        await deleteDictionary(id)
        // 重新获取词典列表
        const updatedList = await getDictionaryList()
        setDictionaryList(updatedList)
      } catch (error) {
        console.error('删除词典失败:', error)
        alert('删除词典失败，请稍后重试。')
      }
    }
  }

  const refreshDictionaryList = async () => {
    try {
      const res = await getDictionaryList()
      setDictionaryList(res)
    } catch (error) {
      console.error('获取词典列表失败:', error)
    }
  }

  useEffect(() => {
    refreshDictionaryList()
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
      {dictionaryList.map((item) => {
        return (
          <Dictionary
            key={item.id}
            id={item.id}
            name={item.name}
            cover={item.cover}
            onClick={() => {
              onShowDetail(item.id)
            }}
            onDelete={handleDeleteDictionary}
            onEditCover={handleEditCover}
            onRename={handleRename}
          />
        )
      })}

      <CreateDictionaryModal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={(name, cover) => {
          addDictionary({ name, cover }).then(() => {
            refreshDictionaryList()
            handleCloseCreateModal()
          })
        }}
      />

      <EditCoverModal
        open={editCoverModal.open}
        onClose={handleCloseEditCover}
        onSave={handleSaveCover}
        currentCover={editCoverModal.currentCover}
        dictionaryName={editCoverModal.dictionaryName}
      />

      <RenameDictionaryModal
        open={renameModal.open}
        onClose={handleCloseRename}
        onRename={handleSaveRename}
        currentName={renameModal.currentName}
      />
    </div>
  )
}

export default Home
