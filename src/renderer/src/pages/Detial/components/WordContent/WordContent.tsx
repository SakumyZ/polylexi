import React from 'react'
import { WordOptions } from '@renderer/api/dictionary'
import { copy2Clipboard, uuid } from '@renderer/utils/common'
import './WordContent.less'
import MaterialSymbolsVolumeUpOutlineRoundedIcon from '@renderer/components/svgIcons/MaterialSymbolsVolumeUpOutlineRounded'
import Flag from '@renderer/components/Flag/Flag'
import MdiContentCopyIcon from '@renderer/components/svgIcons/MdiContentCopy'
import MdiCheckIcon from '@renderer/components/svgIcons/MdiCheck'

interface WordContentProps {
  data: WordOptions[]
}

const WordContent: React.FC<WordContentProps> = ({ data }) => {
  const [copySuccessed, setCopySuccessed] = React.useState(false)
  const [copyedItemId, setCopyedItemId] = React.useState('')

  return (
    <div className="word-content-wrapper">
      <div className="content">
        {data.map((item) => {
          return (
            <div className="content-item" key={uuid()}>
              <Flag lang={item.lang} />
              <MaterialSymbolsVolumeUpOutlineRoundedIcon
                className="volume-icon"
                onClick={() => {
                  // 创建一个新的语音合成对象
                  const synth = window.speechSynthesis
                  const voices = synth.getVoices()
                  const voice = voices.find((voice) => voice.lang === item.lang)

                  // 获取要转换为语音的文本
                  const text = item.word

                  // 创建一个新的语音合成实例
                  const utterance = new SpeechSynthesisUtterance(text)
                  if (voice) {
                    utterance.voice = voice
                  }

                  // 播放语音
                  synth.speak(utterance)
                }}
              />
              <div
                className="word"
                onClick={() => {
                  // 复制到剪贴板
                  copy2Clipboard(item.word)
                  setCopySuccessed(true)
                  setCopyedItemId(item.id.toString())

                  setTimeout(() => {
                    setCopySuccessed(false)
                  }, 1000)
                }}
              >
                <span>{item.word}</span>
                {copySuccessed && copyedItemId === item.id.toString() ? (
                  <MdiCheckIcon />
                ) : (
                  <MdiContentCopyIcon className="copy-icon" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WordContent
