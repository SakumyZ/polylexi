import React, { useState, useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Modal from '../components/Modal'
import ImageCropper from '../components/ImageCropper'
import './CreateDictionaryModal.css'

interface CreateDictionaryModalProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string, cover?: string) => void
}

type FormState = {
  name: string
}

const CreateDictionaryModal: React.FC<CreateDictionaryModalProps> = ({
  open,
  onClose,
  onCreate
}) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm<FormState>()

  const [cover, setCover] = useState<string | null>(null)
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

  const handleClose = () => {
    setCover(null)
    setShowCropper(false)
    setOriginalImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
    clearErrors()
    reset()
  }

  const onSubmit: SubmitHandler<FormState> = (data) => {
    onCreate(data.name.trim(), cover || undefined)
    setCover(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal title="新建词典" open={open} onClose={handleClose}>
        <div className="create-dictionary-modal">
          <div className="create-dictionary-form">
            <div className="form-field">
              <label htmlFor="name" className="form-label required">
                词典名称
              </label>
              <input
                type="text"
                id="name"
                placeholder="请输入词典名称"
                className="form-input"
                {...register('name', { required: '请输入词典名称' })}
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            <div className="form-field">
              <label className="form-label">词典封面</label>
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
    </form>
  )
}

export default CreateDictionaryModal
