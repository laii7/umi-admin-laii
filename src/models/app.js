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
    *siderSlected ({ poayload = {} }, { put, select }) {
      const locationPathname = yield select(({ app }) => app.locationPathname);
      yield put({ type: "onSiderSlected", payload: { ...poayload, locationPathname } });
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
      // console.log('state:',state)
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
      console.log('state:', state)
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

      const { locationPathname } = payload;
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
