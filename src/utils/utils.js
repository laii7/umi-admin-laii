
// 如果使用createBrowserHistory
import creatHistory from 'history/createBrowserHistory';
// import routes from './routes';

import queryString from "query-string";
import { refreshToken } from '@services/login';
import { message } from 'antd';
import { routerRedux } from "dva/router";


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

export const logout = () => {
  window.localStorage.clear();
  window.g_app._store.dispatch(routerRedux.push('/login'))
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

    window.localStorage.clear();
    // 使用promise异步队列保证这个effect是在返回之后执行
    Promise.resolve().then(()=>{
      window.g_app._store.dispatch(routerRedux.push('/login'))
    })
    // window.location.href = '/login'
   
    if (!first) {
      message.error('登录失效，请重新登录')
    }
    return Promise.reject('登录失效，请重新登录');
  }
  const { expire_at } = token;
  const now = new Date().getTime();

  // 刷新token
  if ((expire_at * 1 - now) < 200000 && (expire_at * 1 - now) > 0) {
    await refreshToken();
  }
  // 登录超时
  if ((expire_at * 1 < now)) {

    window.localStorage.clear();
     // 使用promise异步队列保证这个effect是在返回之后执行
    Promise.resolve().then(()=>{
      window.g_app._store.dispatch(routerRedux.push('/login'))
    })
   
    message.error('登录失效，请重新登录')
    return Promise.reject('登录失效，请重新登录');
  }
  return true
}

/**
 * 下载文件
 * @param res 请求响应
 * @returns boolean
 */
export const downloadFile = (res) => {
  const has = res.headers['content-type'].includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  if (!has) { return false };

  const fileName = decodeURI(res.headers["content-disposition"]
    .split(";")[1].split('"')[1])
  // const fileName =decodeURI( res.headers["content-disposition"]
  //       .split(";")[1]
  //       .split("=")[1]
  //       .split('"'));
  let url = window.URL.createObjectURL(new Blob([res.data]));
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  return true
}

