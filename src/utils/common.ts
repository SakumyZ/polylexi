import { v4 } from 'uuid'

export function uuid() {
  return v4()
}

/**
 * 复制文本到剪贴板
 *
 * @param word 要复制的文本
 */
export function copy2Clipboard(word: string) {
  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('value', word)
  document.body.appendChild(input)
  input.select()
  input.setSelectionRange(0, 9999)
  document.execCommand('copy')
  document.body.removeChild(input)
}
