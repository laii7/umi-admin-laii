// id 允许进入页面的权限
// icon 左侧导航栏图标


const menu = [
  {
    name: "订单管理",
    icon: "insurance",
    key: "/order",
    items: [
      {
        id: [0, 1, 2, 3, 4],
        title: "订单查询",
        path: "/list"
      },
    ]
  },
  {
    id:[],
    name: "修改密码",
    icon: "key",
    key: '/changepassword',
    path: "/changepassword"

  },

]
export default menu;