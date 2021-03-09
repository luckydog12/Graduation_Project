// const _import = (file) => {
//   return () => import('views/'+file+'.vue')
// }
// const filterRouter = (routers) => {
//   const accessRouters = routers.filter(route => {
//       if (route.component) {
//           route.component = _import(route.component)
//       }
//       if (route.children && route.children.length) {
//           route.children = filterRouter(route.children)
//       }
//       return true
//   })
//   return accessRouters
// }
// const handleRouter = (routers) => {
//   //此行代码为核心代码，简单粗暴实现深拷贝，否则会改变侧边栏状态
//   console.log('传进来的routers:', routers)
//   // let tempRoute = JSON.parse(JSON.stringify(routers))
//   let tempRoute = [] 
//   routers.map(item => {
//     tempRoute.push(item)
//   })
//   console.log('未处理前:',tempRoute)
//   let tempArr = []
//   const routersChildren = tempRoute[0].children
//   const resultRouters = routersChildren.filter(route => {
//     if(route.children && route.children.length ) {
//       tempArr.push(route)
//       return false
//     } else {
//       return true
//     }
//   })
//   tempArr = tempArr.map(item => {
//     return handleChildren(item)
//   })
//   tempArr.map(item => {
//     resultRouters.push(item)
//   })
//   tempRoute[0].children = resultRouters
//   return tempRoute
// }
// const handleChildren = (routers) => {
//   const result = {}
//   result.path = routers.path + routers.children[0].path
//   result.name = routers.children[0].name
//   result.component = routers.children[0].component
//   return result
// }  