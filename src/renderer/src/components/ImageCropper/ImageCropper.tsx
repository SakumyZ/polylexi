import React, { useRef, useState } from 'react'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import './ImageCropper.css'

interface ImageCropperProps {
  src: string
  onCrop: (croppedImage: string) => void
  onCancel: () => void
  aspectRatio?: number
  cropShape?: 'rect' | 'round'
  quality?: number
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  onCrop,
  onCancel,
  aspectRatio = 1,
  cropShape = 'rect',
  quality = 0.8
}) => {
  const cropperRef = useRef<ReactCropperElement>(null)
  const [cropping, setCropping] = useState(false)
  const [isFixedRatio, setIsFixedRatio] = useState(true) // 是否固定比例
  const [currentAspectRatio, setCurrentAspectRatio] = useState(aspectRatio)

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      setCropping(true)

      // 获取裁切后的canvas
      const canvas = cropper.getCroppedCanvas({
        width: 300, // 宽度保持300
        height: cropShape === 'round' ? 300 : 400, // 高度改为400，保持3:4比例(300:400)
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })

      // 如果是圆形裁切，需要处理成圆形
      if (cropShape === 'round') {
        const roundCanvas = document.createElement('canvas')
        const roundCtx = roundCanvas.getContext('2d')
        const size = Math.min(canvas.width, canvas.height)

        roundCanvas.width = size
        roundCanvas.height = size

        if (roundCtx) {
          // 创建圆形遮罩
          roundCtx.beginPath()
          roundCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
          roundCtx.clip()

          // 绘制图片
          roundCtx.drawImage(canvas, 0, 0, size, size)
        }

        const croppedImage = roundCanvas.toDataURL('image/png', quality)
        onCrop(croppedImage)
      } else {
        const croppedImage = canvas.toDataURL('image/png', quality)
        onCrop(croppedImage)
      }

      setCropping(false)
    }
  }

  const handleReset = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      cropper.reset()
    }
  }

  const handleRotateLeft = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      cropper.rotate(-90)
    }
  }

  const handleRotateRight = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      cropper.rotate(90)
    }
  }

  const handleZoomIn = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      cropper.zoom(0.1)
    }
  }

  const handleZoomOut = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      cropper.zoom(-0.1)
    }
  }

  const handleToggleAspectRatio = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      if (isFixedRatio) {
        // 切换到自由比例
        cropper.setAspectRatio(NaN) // NaN 表示自由比例
        setIsFixedRatio(false)
        setCurrentAspectRatio(NaN)
      } else {
        // 切换到固定比例
        cropper.setAspectRatio(aspectRatio)
        setIsFixedRatio(true)
        setCurrentAspectRatio(aspectRatio)
      }
    }
  }

  return (
    <div className="image-cropper">
      <div className="cropper-container">
        <Cropper
          ref={cropperRef}
          src={src}
          style={{ height: 400, width: '100%' }}
          aspectRatio={currentAspectRatio}
          guides={true}
          dragMode="move"
          scalable={true}
          rotatable={true}
          zoomable={true}
          viewMode={1}
          background={false}
          responsive={true}
          autoCropArea={0.8}
          checkOrientation={false}
          cropBoxMovable={true}
          cropBoxResizable={true}
          toggleDragModeOnDblclick={false}
        />
      </div>

      <div className="cropper-controls">
        <div className="control-group">
          <button type="button" className="control-btn" onClick={handleZoomIn} title="放大">
            🔍+
          </button>
          <button type="button" className="control-btn" onClick={handleZoomOut} title="缩小">
            🔍-
          </button>
          <button type="button" className="control-btn" onClick={handleRotateLeft} title="向左旋转">
            ↶
          </button>
          <button
            type="button"
            className="control-btn"
            onClick={handleRotateRight}
            title="向右旋转"
          >
            ↷
          </button>
          <button
            type="button"
            className={`control-btn ${isFixedRatio ? 'active' : ''}`}
            onClick={handleToggleAspectRatio}
            title={isFixedRatio ? '切换到自由比例' : '切换到固定比例'}
          >
            📐
          </button>
          <button type="button" className="control-btn" onClick={handleReset} title="重置">
            🔄
          </button>
        </div>

        <div className="action-group">
          <button type="button" className="cancel-btn" onClick={onCancel} disabled={cropping}>
            取消
          </button>
          <button type="button" className="crop-btn" onClick={handleCrop} disabled={cropping}>
            {cropping ? '处理中...' : '确认裁切'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper
