import axios from "axios";
import queryString from "query-string";
// import { verifyToken } from '@utils/utils';
import { noAuth } from '@config/config'
const defaultUrl = '';

// 配置axios默认行为
axios.defaults.timeout = 10000;

// axios.defaults.headers.post["Content-Type"] = "application/json";
// axios.defaults.headers.common['Content-Type'] = "application/json";


axios.defaults.baseURL = defaultUrl;

// axios.defaults.crossDomain = true;
// axios.defaults.async = true;
// axios.defaults.withCredentials = true

// 请求拦截器
axios.interceptors.request.use(
  async config => {

    let token = queryString.parse(localStorage.getItem('token') || {});
    // 需要校验token的api
    if (!noAuth.includes(config.url)) {
      // verifyToken();
    }
    config.headers.common['Authorization'] = 'Bearer ' + token.token;
    return config;
  },
  error => {
    return Promise.reject('系统错误，请稍后尝试');
    // console.log("error:", error);
  }
);
// // 响应拦截器
axios.interceptors.response.use(
  res => {
    const { code, msg } = res.data;
    if (code !== 0) {
      if (code === 501) {
        if (msg) {
          return {
            data: {
              fail: true,
              data: {
                msg,
              }
            }
          };
          // return Promise.reject(msg);
        }
      }
      if (code === 500) {
        if (msg) {
          return Promise.reject(msg);
        }
        return Promise.reject('系统错误，请稍后尝试');
      }
      return Promise.reject(msg);
    }
    return res;
  },
  error => {
    const { status } = error.response || '';
    switch (status) {
      case 403:
        // goTo('/permission-deny');
        return Promise.reject('没有权限!');
      case 401:
        // redirectTo('/login');
        window.localStorage.clear();
        window.location.href = '/login';
        return Promise.reject('登录失效，请重新登录');
      default:
        return Promise.reject('系统错误，请稍后尝试');
    }
  }
);

/**
 * get请求
 * @param url 请求url
 * @param params  请求参数
 * @returns {Promise<any>}
 */
export function get (options) {
  return new Promise((resolve, reject) => {
    axios
      .get(options.url, {
        params: options.data
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url请求url
 * @param data 请求参数
 * @returns {Promise}
 */

export function post (options) {
  return new Promise((resolve, reject) => {
    axios.post(options.url, options.data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 封装put请求
 * @param url请求url
 * @param data 请求参数
 * @returns {Promise}
 */

export function put (options) {
  return new Promise((resolve, reject) => {
    axios.put(options.url, options.data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}
export function deleteReq (options) {
  return new Promise((resolve, reject) => {
    axios.delete(options.url, options.data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}



export function postJSON (options) {
  return new Promise((resolve, reject) => {
    axios.post(options.url, options.data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 封装下载请求
 * @param url请求url
 * @param params 请求参数
 * @returns {Promise}
 */

export function download (params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(params.url, {
        params: params.data,
        responseType: "blob" //要设置接收请求类型
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

