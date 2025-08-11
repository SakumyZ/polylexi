import { Menu, MenuItemConstructorOptions, dialog, BrowserWindow } from 'electron'
import fs from 'node:fs'
import { importWords } from '@main/api/word'

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
                    console.error(err)
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
          console.log('导出词典')
        },
        accelerator: 'Alt+O'
      }
    ]
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
          console.log('关于应用')
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
