# Bookmark Vue - 智能化书签收藏夹
基于 Vue 3 + TypeScript + Element Plus 构建的现代化书签管理前端应用，提供优雅的用户界面和流畅的交互体验。
## 技术栈
  - 核心框架
    - Vue 3 - 渐进式 JavaScript 框架
    - TypeScript - 类型安全的 JavaScript 超集
    - Vite - 下一代前端构建工具

  - UI 组件库
    - Element Plus - 基于 Vue 3 的组件库
    - Element Plus Icons - 图标库

  - 状态管理与路由
    - Pinia - Vue 官方状态管理库
    - Vue Router 4 - 官方路由管理器

  - 工具库
    - Axios - HTTP 请求库
    - Lodash - JavaScript 实用工具库
    
  - 开发工具
    - Vue DevTools - Vue 应用调试工具
    - Auto Import - 自动导入 API
    - Vue Components - 自动导入组件

  ## 项目特色

  - 现代化开发体验
    - Vite 构建 - 极速的热重载和构建速度
    - TypeScript 支持 - 完整的类型检查和智能提示
    - 组合式 API - Vue 3 最新的开发模式
    - 优雅的 UI 设计

  -  优雅的 UI 设计
    - Element Plus 组件 - 丰富且美观的 UI 组件
    - 响应式布局 - 布局自适应
    - 现代化的工具链 - 最新的开发工具和最佳实践
  
  -  高效的开发配置
    - 自动导入 - 无需手动导入常用 API 和组件
    - TypeScript 严格模式 - 保障代码质量
    - 现代化的工具链 - 最新的开发工具和最佳实践
  
  ## 快速开始

**环境要求**
  - Node.js: ^20.19.0 || >=22.12.0

**安装依赖**

  ```
  npm install
  ```

  **开发模式**

  ```
    npm run dev
  ```

**构建生产版本**

  ```
    npm run build
  ```  

**类型检查**

  ```
    npm run type-check
  ```  

**预览构建结果**

  ```
    npm run preview
  ```

## 项目结构

  ```
    src/
      ├── components/     # 可复用组件
      ├── views/         # 页面组件
      ├── stores/        # Pinia 状态管理
      ├── router/        # 路由配置
      ├── types/         # TypeScript 类型定义
      └── assets/        # 静态资源
  ```
## 后端对接

  本项目与 [SpringBoot Bookmark](https://github.com/dengxm1/springboot-bookmark) 后端 配套使用，提供完整的书签管理功能：

  - ✅ 用户认证与授权

  - ✅ 书签增删改查

  - ✅ 标签管理

  - ✅ 搜索与筛选

  - ✅ 数据同步

## 核心功能

  - 用户界面：现代化的书签管理界面

  - 标签系统：灵活的书签分类和筛选

  - 搜索功能：快速定位所需书签

  - 响应式设计：布局自适应

  - 类型安全：完整的 TypeScript 支持