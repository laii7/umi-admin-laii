
// 如果使用createBrowserHistory
import creatHistory from 'history/createBrowserHistory';
// import routes from './routes';
import { allow } from '@config/config';
import queryString from "query-string";
import { refreshToken } from '@services/login';
import { message } from 'antd';
import { routerRedux } from "dva/router";

import umirc from '../../.umirc';
//引用真实路由
const { routes } = umirc;

// 检索当前权限下可进行的操作
export const canOperate = (id) => {
  const userType = JSON.parse(window.localStorage.getItem('USER_TYPE') || '-1');
  if (typeof id === 'number') {
    return userType * 1 === id;
  } else {
    return id.some(item => {
      return userType * 1 === item * 1;
    })
  }
}

const validPermission = (route, pathname) => {
  let flag = true;
  const userType = JSON.parse(window.localStorage.getItem('USER_TYPE') || '-1');
  if (route.path === pathname) {
    if (!route.id || route.id.length === 0) {
      flag = true
    } else {
      flag = route.id.includes(userType);
    }
  }
  return flag;
}

// 检索当前权限下可跳转的页面
export const canJump = (pathname = '') => new Promise((resolve) => {
  if (!pathname) resolve(true);
  let flag = true;
  if (allow.includes(pathname)) {
    resolve(true);
  }
  routes.forEach(item => {
    //如果是顶层
    if (!item.routes) {
      flag = validPermission(item, pathname)
    } else {
      //如果是第二层
      item.routes.forEach(child => {
        flag = validPermission(child, pathname)
      })
    }
  })
  resolve(flag);
});
// 检索当前权限下可展示的菜单项
export const canShowMenu = (items, step) => {
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
  const userType = JSON.parse(window.localStorage.getItem('USER_TYPE') || '-1');
  if (idList.includes(userType)) {
    if (!items.items) {
      return 2
    } else {
      return 1
    }
  } else {
    return false;
  }
}
// 检索当前权限下可展示的菜单分类
export const canShowMenuType = (id = []) => {
  const userType = JSON.parse(window.localStorage.getItem('USER_TYPE') || '-1');
  return id.includes(userType)
}

export function formatDate (time) {
  var date = new Date(time);
  var year = date.getFullYear(),
    month = date.getMonth() + 1, //月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  var newTime =
    year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  return newTime;
}

export function getTime (seven = false) {
  var timestamp = Date.parse(new Date()) - 60 * 60 * 24 * 7 * 1000;
  let date = new Date();
  if (seven) {
    date = new Date(timestamp);
  } else {
    date = new Date();
  }
  const yearh = date.getFullYear();
  const month = date.getMonth() + 1;
  let day = date.getDate();

  const time = `${yearh}/${month < 10 ? ('0' + month) : month}/${day < 10 ? ('0' + day) : day}`;
  return time;
}

export const goback = () => {
  const history = creatHistory();
  history.goBack();
}

export const goTo = (url) => {
  const history = creatHistory();
  history.push(url);
}

export const redirectTo = (url) => {
  const history = creatHistory();
  history.replace(url);
}


/**
 * 图片链接转base64
 * @param imgUrl
 * @returns {Promise<any>}
 */
export const getBase64 = (imgUrl) => {
  return new Promise(((resolve, reject) => {
    window.URL = window.URL || window.webkitURL;
    let xhr = new XMLHttpRequest();

    //需要拼接时间戳才能访问阿里云oss资源（玄学）
    xhr.open("get", imgUrl + '&v_1=' + new Date(new Date().getTime() + 300 * 1000), true);

    // 至关重要
    xhr.responseType = "blob";
    xhr.onload = function () {
      if (this.status === 200) {
        //得到一个blob对象
        let blob = this.response;
        // 至关重要
        let oFileReader = new FileReader();
        oFileReader.onloadend = function (e) {
          let base64 = e.target.result;
          resolve(base64)
        };
        oFileReader.readAsDataURL(blob);
      }
    }
    xhr.send();
  }))

}

/**
 * 下载文件
 * @param fileUrl 文件url
 * @returns {Promise<any>}
 */
export const getFile = (fileUrl) => {
  return new Promise(((resolve, reject) => {
    window.URL = window.URL || window.webkitURL;
    let xhr = new XMLHttpRequest();
    //需要拼接时间戳才能访问阿里云oss资源（玄学）
    xhr.open("get", fileUrl + '&v_1=' + new Date(new Date().getTime() + 300 * 1000),
      true);
    // 至关重要
    xhr.responseType = "blob";
    xhr.onload = function () {
      if (this.status === 200) {
        //得到一个blob对象
        let blob = this.response;
        resolve(blob)
      }
    }
    xhr.send();
  }))
}

/**
 * 校验用户凭证
 * @param {*} first  是否为第一次登录
 */
export const verifyToken = async (first = true) => {

  let token = queryString.parse(localStorage.getItem('token') || {});

  if (!token || !token.token) {
    window.g_app._store.dispatch(routerRedux.push('/login'))
    window.localStorage.clear();
    if (!first) {
      message.error('登录失效，请重新登录1')
    }
    return Promise.reject('登录失效，请重新登2录');
  }
  const { expire_at } = token;
  const now = new Date().getTime();

  // 刷新token
  if ((expire_at * 1 - now) < 200000 && (expire_at * 1 - now) > 0) {
    await refreshToken();
    token = queryString.parse(localStorage.getItem('USER_AUTH') || {});
  }
   // 登录超时
  if ((expire_at * 1 < now)) {
    window.g_app._store.dispatch(routerRedux.push('/login'))
    window.localStorage.clear();
    message.error('登录失效，请重新登录')
    return Promise.reject('登录失效，请重新登录');
  }
  return true
}

