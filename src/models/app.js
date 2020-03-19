import queryString from "query-string";
import { routerRedux } from "dva/router";
import { menuConfig } from "@config";
import { canJump } from '@utils/utils';
import { getMyPermission } from "@services/permission";
import { verifyToken } from '@utils/utils';


export default {
  namespace: "app",
  state: {
    collapsed: false,
    breadList: [
      {
        icon: "",
        text: ""
      }
    ],
    menu: {
      // selectedItem: ["/unconfirm"],
      // selectedType: ["/plan"]
    },
    // permissions: {},
    menuList: [],
  },
  subscriptions: {
    // 设置权限
    setPermission ({ dispatch, history }) {
      const { location } = history;
      if (location.pathname !== "/login") {
        const flag = verifyToken();
        if (flag === true) {
          dispatch({ type: 'queryPermission', })
        }
      }
    },
    setupHistory ({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: "updateState",
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search)
          }
        });
        if (location.pathname === '/') {
          dispatch(routerRedux.push('/order/list'))
        }
      });
    },

    setup ({ dispatch, history }) {

      history.listen(location => {

        const { pathname } = location;
        if (pathname !== '/login') {
          verifyToken().then(res => {
            if (res) {
              dispatch({ type: "canJump", payload: location.pathname });
            }
          });
        }
        //  const flag = verifyToken();
        dispatch({ type: "resetBteadList" });

        dispatch({ type: "siderSlected" });
      });
      dispatch({ type: "query" });
      let tid;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({ type: "changeNavbar" });
        }, 300);
      };
    }
  },
  effects: {
    // 获取本人权限
    *queryPermission ({ poayload = {} }, { put, call }) {
      const { data } = yield call(getMyPermission, poayload);
      window.localStorage.setItem('USER_TYPE', data + '')
      // const { permissions, roles } = data || [];
      // // 序列化到本地，防止用户会翻看，只序列化id
      // const permissionsArray = permissions.map(item => {
      //   return item.id
      // })
      // // 序列化到本地，只序列化角色名字
      // const rolName = roles.map(role => {
      //   return role.name
      // })

      // if (permissionsArray.length === 0) {
      //   yield put(routerRedux.replace("/login"));
      //   window.localStorage.clear();
      //   return;
      // } else {
      //   window.localStorage.setItem('PER', JSON.stringify(permissionsArray));
      //   window.localStorage.setItem('ROL', JSON.stringify(rolName))
      // }
      // yield put({ type: 'setPermissionData', payload: data })

    },
    // 注销登录
    *logout ({ poayload = {} }, { put }) {
      window.localStorage.clear();
      window.localStorage.clear();
      yield put(routerRedux.replace("/login"));
      yield put({ type: "siderSlected" });
    },
    // 判断是否允许跳转页面
    *canJump ({ payload = {} }, { call, put }) {
      const result = yield call(canJump, payload);
      if (!result && payload) {
        yield put(routerRedux.replace("/401"));
      } else {
      }
    },
    *siderSlected ({ poayload = {} }, { put }) {
      yield put({ type: "onSiderSlected", poayload });
    }
  },
  reducers: {
    setPermissionData (state, { payload }) {
      return {
        ...state,
        permissions: payload
      }
    },
    // 切换侧边菜单的展示状态
    toggleCollapsed (state, { payload }) {
      return {
        ...state,
        collapsed: payload
      }
    },
    // 设置面包屑
    setBreadList (state, { payload }) {
      return {
        ...state,
        breadList: [...state.breadList, ...payload]
      }
    },

    // 重置菜单面包屑
    resetBteadList (state) {
      return {
        ...state,
        breadList: [{
          icon: "",
          text: ""
        }]
      };
    },

    // 删除面包屑最后一位
    setLastBreadList (state, { payload }) {
      state.breadList.splice(state.breadList.length - 2, 2);
      return {
        ...state,
        breadList: [...state.breadList, ...payload]
      };
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    // 选择侧边导航栏
    onSiderSlected (state, { payload }) {
      const { location } = window;
      if (location.pathname) {
        const urlArray = location.pathname.split("/");
        let current = [];
        if (urlArray.length < 3) {
          if (urlArray.length === 2) {

            if (!menuConfig.items) {
              menuConfig.forEach(item => {
                if ('/' +urlArray[1] === item.key) {
                  // 查询判断是否已经有这个面包屑
                  current = [{
                    key: item.key,
                    icon: item.icon,
                    text: item.name
                  }]

                }
              });
            }

            return {
              ...state,
              breadList: current,
              menu: {
                selectedItem: [ '/' +urlArray[1]],
              }
            };
          }
          return {
            ...state,
            menu: {
              // selectedItem: ["/umcomfire"],
              // selectedType: ["/plan"]
            }
          };
        }
        

        let first = {};
        let secound = null;
        menuConfig.forEach(menuType => {
          if (menuType.key) {
            urlArray.forEach(url => {
              if ("/" + url === menuType.key) {
                first = {
                  key: menuType.key,
                  icon: menuType.icon,
                  text: menuType.name,
                }
                current.push({
                  key: menuType.key,
                  icon: menuType.icon,
                  text: menuType.name,
                });
              }
              if (menuType.items) {
                menuType.items.forEach(item => {
                  if (location.pathname === menuType.key + item.path) {
                    // 查询判断是否已经有这个面包屑

                    if (!current.some(c => c.key === item.path + menuType.key)) {

                      current.push({
                        key: menuType.key + item.path,
                        icon: "",
                        text: item.title
                      })
                      secound = {
                        key: menuType.key + item.path,
                        icon: "",
                        text: item.title
                      }
                    }
                  }
                });
              }
            });
          }
        });
        if (secound) {
          current = [first, secound]
        } else {
          current = [first];
        }
        return {
          ...state,
          current,
          breadList: current,
          menu: {
            selectedItem: ["/" + urlArray[1] + "/" + urlArray[2]],
            selectedType: ["/" + urlArray[1]]
          }
        };
      }
    }
  }
};
