
import { allow } from '@config/config';
import umirc from '../../.umirc';

//引用真实路由
const { routes } = umirc;

const validPermission = (route, pathname) => {
  return new Promise(resolve => {
    //从全局数据流里面拿当前权限
    window.g_app._store.dispatch({ type: 'app/queryLocalPermission' }).then(userType => {
      if (route.path === pathname) {
        if (!route.id || route.id.length === 0) {
          resolve(true)
        } else {
          resolve(route.id.includes(userType));
        }
      }
    })
  })
}


//检索当前允许跳转的路由，返回路由列表
export const validRouter = (type) => new Promise(resolve => {
  const current = [];
  routes.forEach(item => {
    if (!item.routes) {
      if (!item.id || item.id.length === 0 || item.id.includes(type)) {
        item.path && current.push(item.path);
      }
    } else {
      item.routes.forEach(child => {
        if (!child.id || child.id.length === 0 || child.id.includes(type)) {
          child.path && current.push(child.path);
        }
      })
    }
  })
  resolve(current);

})

// 检索当前权限下可跳转的页面
export const canJump = (pathname = '') => new Promise((resolve) => {

  if (!pathname) resolve(true);
  if (allow.includes(pathname)) {
    resolve(true);
  }
  routes.forEach(item => {
    //如果是顶层
    if (!item.routes) {
      validPermission(item, pathname).then(res => {
        resolve(res);
      })
    } else {
      //如果是第二层
      item.routes.forEach(child => {
        validPermission(child, pathname).then(res => {
          resolve(res);
        })
      })
    }
  })
});

/**
 *  检索当前权限下可展示的菜单项
 * @param {*} 菜单项 
 * @param {*} 1为一级菜单，2为二级菜单 
 * @param {*} 当前权限 
 */
export const canShowMenu = (items, step, per) => {
  if (!items) {
    return true;
  }
  let idList = [];

  if (step === 1) {
    if (items.items) {
      items.items.forEach(it => {
        idList = [...idList, ...it.id]
      })
      if (!idList.length) {
        return 1;
      }
    } else {
      idList = [...items.id]
      if (!idList.length) {
        return 2;
      }
    }


  } else {
    idList = [...items]
  }
  // const userType = JSON.parse(window.localStorage.getItem('USER_TYPE') || '-1');
  if (idList.includes(per)) {
    if (!items.items) {
      return 2
    } else {
      return 1
    }
  } else {
    return false;
  }
}