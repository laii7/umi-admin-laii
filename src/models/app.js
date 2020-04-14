import queryString from "query-string";
import { routerRedux } from "dva/router";
import { menuConfig } from "@config";
import { canJump, validRouter } from '@utils/permission';
import { getMyPermission } from "@services/permission";
import { verifyToken } from '@utils/utils';

export default {
  namespace: "app",
  state: {
    collapsed: false,
    isListen: false,
    locationPathname: '',
    breadList: [{ icon: "", text: "" }],
    menu: {
      // selectedItem: ["/list"],
      // selectedType: ["/order"]
    },
    permission: '-1',
    userRouter: ['/login'],
    menuList: [],
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {

      history.listen(location => {
        dispatch({
          type: "updateState",
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search)
          }
        });
      });
    },

    // 设置权限
    setPermission ({ dispatch, history }) {
      const { location } = history;
      if (location.pathname !== "/login") {
        if (location.pathname === '/') {
          dispatch(routerRedux.push("/order/list"));
        }
        verifyToken().then(res => {
          if (res) {
            //已登录则查询本人权限
            dispatch({ type: 'queryPermission' }).then(() => {
              dispatch({ type: 'changeListen' })
              history.listen(local => {
                if (local.pathname !== "/login") {
                  verifyToken().then(() => {
                    // dispatch({ type: "canJump", payload: local.pathname })
                    dispatch({ type: "checkRouter", payload: local.pathname })
                  })
                  dispatch({ type: "resetBteadList" });
                  dispatch({ type: "siderSlected" });
                }
              });
            }).catch(() => {
              window.location.href = '/login';
            })

          }
        });
      }
    },
  },
  effects: {
    // 获取远端本人权限
    *queryPermission ({ poayload = {} }, { put, call }) {
      try {
        const { data } = yield call(getMyPermission, poayload);
        yield put({ type: 'setPermissionData', payload: data });
        const userRouter = yield call(validRouter, data);
        yield put({ type: 'setUserRouter', payload: userRouter });
        return userRouter
      } catch (err) {
        yield put({ type: 'logout' });
        window.location.href = '/login'
      }
    },
    // 检索本地本人权限
    *queryLocalPermission ({ payload = {} }, { select }) {
      const permission = yield select(({ app }) => app.permission);
      return permission;
    },
    // 注销登录
    *logout ({ poayload = {} }, { put }) {
      window.localStorage.clear();
      yield put(routerRedux.replace("/login"));
      yield put({ type: 'setPermissionData', payload: '-1' });
      yield put({ type: "siderSlected" });
    },
    // 判断是否允许跳转页面
    *canJump ({ payload = {} }, { call, put }) {
      const result = yield call(canJump, payload);
      if (!result && payload) {
        yield put(routerRedux.replace("/401"));
      }
    },
    // 查找用户当前是否存在这条路由
    *checkRouter ({ payload = {} }, { call, put, select }) {
      const userRouter = yield select(({ app }) => app.userRouter);
      if (!userRouter.includes(payload)) {

        yield put(routerRedux.replace("/401"));
      }
    },

    //选择侧边导航栏
    *siderSlected ({ poayload = {} }, { put, select }) {
      const locationPathname = yield select(({ app }) => app.locationPathname);
      if (locationPathname !== '/') {
        yield put({ type: "onSiderSlected", payload: { ...poayload, locationPathname } });
      }

    }
  },
  reducers: {
    setPermissionData (state, { payload }) {
      return {
        ...state,
        permission: payload
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
      const newBread = [...state.breadList, ...payload];
      return {
        ...state,
        breadList: [...new Set(newBread.map(item => queryString.stringify(item)))].map(item => queryString.parse(item)),
      }
    },
    // 
    changeListen (state, { payload }) {
      if (!state.isListen) {
        return {
          ...state,
          isListen: true
        }
      }
    },

    //设置当前用户可访问的路由
    setUserRouter (state, { payload }) {
      return {
        ...state,
        userRouter: payload
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
      const { locationPathname } = state;
      let current = [],
        menu = {},
        type = locationPathname && '/' + locationPathname.split('/')[1],
        isDone = false;
      menuConfig.forEach(menuType => {
        //如果是一级菜单
        if (!menuType.items) {
          menuConfig.forEach(item => {
            if (locationPathname === item.path) {
              current = [{
                key: item.key,
                icon: item.icon,
                text: item.name
              }];
              menu = {
                selectedItem: [locationPathname],
              }
            }
          });
        } else {
          menuType.items.forEach(item => {
            //当前是否为二级菜单
            if (type === menuType.key) {
              //当前二级菜单是否选中侧边栏
              if (menuType.key + item.path === locationPathname) {
                menu = {
                  selectedType: [menuType.key],
                  selectedItem: [locationPathname]
                }
                current = [
                  {
                    key: menuType.key,
                    icon: menuType.icon,
                    text: menuType.name
                  },
                  {
                    key: locationPathname,
                    icon: "",
                    text: item.title
                  },
                ]
                isDone = true;
              } else if (!isDone) {
                current = [
                  {
                    key: menuType.key,
                    icon: menuType.icon,
                    text: menuType.name
                  },
                ]
              }
            }

          })
        }
      })
      return {
        ...state,
        breadList: current,
        menu,
      };
    }
  }
};
