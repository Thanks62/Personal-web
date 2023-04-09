import React, { lazy } from "react"
import Home from "../pages/home"
import ICON_NOTES from "@/assets/icons/notes.png";
import ICON_WORKS from "@/assets/icons/works.png";
/**
 * @param path 路由路径
 * @param name 路由名称
 * @param icon 
 * @param component
 * @param auth
 * @param hideInMenu
 * @param children
 */
const lazyload = (path) => {
    const Comp = lazy(() => import(`@/pages/${path}`))
    return (
      <React.Suspense fallback="loading...">
        <Comp />
      </React.Suspense>
    )
}
export const routersConfig = [
    {
        path: '/home',
        name: '首页',
        hideInMenu: true,
        component: <Home />
    },
    {
        path: '/works',
        name: '作品集',
        icon: <img src={ICON_WORKS} alt="WORKS" width={30} />,
        component: lazyload("works/index"),
        children: [{
            path: '/details/:id',
            name: '作品集详情',
            hideInMenu: true,
            component: lazyload("works-detail/index")
        }]
    },
    {
        path: '/notes',
        name: '笔记',
        icon: <img src={ICON_NOTES} alt="NOTES" width={20} />,
        component: lazyload("notes/index"),
        children: [{
            path: '/details/:id',
            name: '笔记详情',
            hideInMenu: true,
            component: lazyload("note-detail/index")
        }]
    },
    {
      path: '/404',
      name: '页面丢失',
      hideInMenu: true,
      component: lazyload("system/404")
    }
]
export const routers = (() => {
  let result = []
  function flatRouter(routers, pathPrefix) {
    routers.forEach(router => {
    router.path = pathPrefix + router.path
    result.push(router)
    if(router.children) {
        flatRouter(router.children, router.path)
    }
    })
  }
  flatRouter(routersConfig, '')
  return result
})()