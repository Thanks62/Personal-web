# React架构

### 一、React三大核心

- React Core: 全局React Api

  - React.createElement()

  - React.Component

  - React.Children

  - ...

- 渲染器

  用于管理一颗渲染树，根据不同的底层平台调用不同的渲染器

  - React Dom Render -> 浏览器，react-dom库
  - React Native Render -> RN Native视图，react-native-renderer
  - React Test Render -> JSON树，用于jest快照测试，react-test-renderer库

- 协调算法reconcilers
  - stack reconciler -> React 15及以下
    - 基于递归，不可中断
  - Fiber reconciler -> React 16+ 
    - 基于链表，切片式任务
    - 任务优先级
    - render()返回多个元素
    - 支持错误边界

- 其他：事件系统

  实现合成事件，适用于React Dom和React Native

