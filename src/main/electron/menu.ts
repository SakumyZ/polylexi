import { Menu, MenuItemConstructorOptions, dialog, BrowserWindow } from 'electron'
import fs from 'node:fs'
import { importWords } from '@main/api/word'
import logger from '@main/utils/logger'

const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: '文件',
    click(menuItem, browserWindow, event) {
      console.log(menuItem, browserWindow, event)
    },
    accelerator: 'Alt+E',
    submenu: [
      {
        label: '导入词典',
        click() {
          // 打开文件管理器选择文件
          dialog
            .showOpenDialog({
              properties: ['openFile'],
              filters: [{ name: '词典文件', extensions: ['json'] }]
            })
            .then((res) => {
              if (!res.canceled && res.filePaths.length > 0) {
                const filePath = res.filePaths[0]

                // 读取文件内容
                fs.readFile(filePath, 'utf-8', (err, data) => {
                  if (err) {
                    logger.error(err)
                    return
                  }

                  const json = JSON.parse(data)

                  importWords(json)
                })
              }
            })
        },
        accelerator: 'Alt+I'
      },
      {
        label: '导出词典',
        click() {
          logger.debug('导出词典')
        },
        accelerator: 'Alt+O'
      }
    ]
  },
  {
    label: '设置',
    click(_menuItem, browserWindow) {
      // 通过IPC发送消息到渲染进程，打开设置页面
      const bw = browserWindow as BrowserWindow
      if (bw) {
        bw.webContents.send('open-settings')
      }
    }
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '切换开发者工具',
        click(_, browserWindow) {
          const bw = browserWindow as BrowserWindow
          bw?.webContents.toggleDevTools()
        },
        accelerator: 'F12'
      },
      {
        type: 'separator'
      },
      {
        label: '关于',
        click() {
          logger.debug('关于应用')
        }
      }
    ]
  }
]

const createAppMenu = () => {
  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
}

export default createAppMenu
