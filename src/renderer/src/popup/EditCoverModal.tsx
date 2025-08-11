import React, { useState, useRef } from 'react'
import Modal from '../components/Modal'
import ImageCropper from '../components/ImageCropper'
import './CreateDictionaryModal.css'

interface EditCoverModalProps {
  open: boolean
  onClose: () => void
  onSave: (cover: string | null) => void
  currentCover?: string | null
  dictionaryName: string
}

const EditCoverModal: React.FC<EditCoverModalProps> = ({
  open,
  onClose,
  onSave,
  currentCover,
  dictionaryName
}) => {
  const [cover, setCover] = useState<string | null>(currentCover || null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      // 检查文件大小（限制为5MB，因为要进行裁切处理）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setOriginalImage(result)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCrop = (croppedImage: string) => {
    setCover(croppedImage)
    setShowCropper(false)
    setOriginalImage(null)
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setOriginalImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCoverClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveCover = () => {
    setCover(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = () => {
    onSave(cover)
    handleClose()
  }

  const handleClose = () => {
    setCover(currentCover || null)
    setShowCropper(false)
    setOriginalImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  // 如果正在显示裁切器，返回裁切界面
  if (showCropper && originalImage) {
    return (
      <Modal title="裁切图片" open={open} onClose={handleCropCancel} actions={<></>}>
        <ImageCropper
          src={originalImage}
          onCrop={handleCrop}
          onCancel={handleCropCancel}
          aspectRatio={3 / 4} // 改为3:4比例，与词典卡片和预览区域保持一致
          quality={0.8}
        />
      </Modal>
    )
  }

  return (
    <Modal
      title={`修改「${dictionaryName}」封面`}
      open={open}
      onOk={handleSave}
      onClose={handleClose}
    >
      <div className="create-dictionary-modal">
        <div className="create-dictionary-form">
          <div className="form-field">
            <label className="field-label">词典封面</label>
            <div className="cover-preview-area">
              {cover ? (
                <div className="cover-preview">
                  <img src={cover} alt="词典封面" className="cover-image" />
                  <button onClick={handleRemoveCover} className="remove-cover-btn">
                    ×
                  </button>
                </div>
              ) : (
                <div className="upload-area" onClick={handleCoverClick}>
                  <span className="upload-icon">+</span>
                  <span className="upload-text">
                    点击上传封面
                    <br />
                    (可选)
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden-input"
              />
            </div>
            <p className="upload-hint">支持 JPG、PNG 格式，大小不超过 5MB，上传后可进行裁切</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default EditCoverModal
