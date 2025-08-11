# Polylexi - 多语言词典应用

<div align="center">

![Polylexi](https://img.shields.io/badge/Polylexi-多语言词典-blue)
![Electron](https://img.shields.io/badge/Electron-31+-blue)
![React](https://img.shields.io/badge/React-19+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![SQLite](https://img.shields.io/badge/SQLite-3+-green)

一个基于 Electron + React + TypeScript 开发的跨平台多语言词典应用

</div>

## 📋 项目简介

Polylexi 是一个功能丰富的多语言词典管理应用，支持创建、管理和使用多种语言的词汇库。应用采用现代化的技术栈，提供直观的用户界面和强大的功能。

### 🌟 核心特性

- **📚 词典管理**: 创建、重命名、删除多个词典
- **🌍 多语言支持**: 内置支持中文、英文、日文三种语言
- **🎨 封面定制**: 支持词典封面图片上传与裁切
- **📝 词汇编辑**: 添加、编辑、查看词汇条目
- **🔍 智能搜索**: 词汇快速检索功能
- **🔊 语音播放**: 词汇发音朗读功能
- **📋 快捷复制**: 一键复制词汇到剪贴板
- **📥 导入导出**: 支持 JSON 格式词典文件导入

## 🚀 已实现功能

### 词典管理

- ✅ **创建词典**: 新建自定义词典，支持封面上传
- ✅ **重命名词典**: 修改词典名称
- ✅ **删除词典**: 安全删除词典及相关数据
- ✅ **封面管理**: 上传、裁切、更新词典封面图片

### 图片处理

- ✅ **智能裁切**: 基于 react-cropper 的专业图片裁切功能
- ✅ **比例控制**: 支持固定 1:1 比例和自由比例切换
- ✅ **图片操作**: 缩放、旋转、重置等编辑工具
- ✅ **文件存储**: 本地文件系统存储，支持多种图片格式

### 词汇功能

- ✅ **多语言词条**: 同一词汇的中文、英文、日文对应
- ✅ **词汇编辑**: 添加、修改词汇条目
- ✅ **语音朗读**: 基于 Web Speech API 的发音功能
- ✅ **快捷复制**: 点击复制词汇到剪贴板
- ✅ **词汇搜索**: 按词汇内容搜索过滤

### 数据管理

- ✅ **本地存储**: SQLite 数据库本地存储
- ✅ **文件管理**: 封面图片文件系统管理
- ✅ **数据导入**: JSON 格式词典文件导入
- ✅ **CRUD 操作**: 完整的增删改查功能

## 🔧 技术栈

### 前端技术

- **框架**: React 19 + TypeScript
- **构建工具**: Vite + Electron Vite
- **UI 组件**: 自定义组件库
- **图片处理**: react-cropper + sharp

### 后端技术

- **桌面应用**: Electron 37+
- **数据库**: better-sqlite3
- **文件处理**: fs-extra
- **进程通信**: Electron IPC

### 开发工具

- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript 5+
- **包管理**: npm
- **构建打包**: electron-builder

## 📦 安装与使用

### 环境要求

- Node.js 18+
- npm 8+

### 开发环境

```bash
# 克隆项目
git clone [repository-url]
cd polylexi

# 安装依赖
npm install

# 启动开发服务器
npm dev
```

### 构建发布

```bash
# Windows
npm build:win

# macOS
npm build:mac

# Linux
npm build:linux
```

## 🎯 待完成功能

### 高优先级

- ❌ **切换主语言**: 
- ❌ **全局搜索**: 跨词典的全局词汇搜索功能
- ❌ **词典导出**: 将词典导出为 JSON 或其他格式
- ❌ **批量导入**: 批量导入词汇数据
- ❌ **数据备份**: 应用数据备份与恢复
- ❌ **用户引导**: 第一次使用系统时给用户进行引导

### 中优先级

- ❌ **主题系统**: 深色/浅色主题切换
- ❌ **快捷键**: 全局快捷键支持
- ❌ **词汇统计**: 词典词汇数量统计
- ❌ **学习模式**: 单词学习和测试功能

### 低优先级
- ❌ **更多语言**: 扩展支持更多语言

## 📁 项目结构

```
src/
├── main/                   # 主进程代码
│   ├── api/               # IPC API 处理
│   ├── electron/          # Electron 配置
│   └── utils/             # 工具函数
├── renderer/              # 渲染进程代码
│   ├── src/
│   │   ├── api/          # 前端 API
│   │   ├── components/   # 通用组件
│   │   ├── pages/        # 页面组件
│   │   ├── popup/        # 弹窗组件
│   │   └── utils/        # 工具函数
│   └── index.html
└── preload/               # 预加载脚本
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议。

<div align="center">

**⭐ 如果这个项目对您有帮助，请给它一个 Star！**

</div>
