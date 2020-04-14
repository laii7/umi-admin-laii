
// ref: https://umijs.org/config/

import config from "./src/config/config";
// import routes from './src/utils/routes';
import path from 'path';
export default {
  treeShaking: true,
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@config': path.resolve(__dirname, 'src/config'),
    '@assets': require('path').resolve(__dirname, 'src/assets'),
    '@components': require('path').resolve(__dirname, 'src/components'),
    '@operate': require('path').resolve(__dirname, 'src/components/permission/Operate'),
    '@services': require('path').resolve(__dirname, 'src/services'),
    '@models': require('path').resolve(__dirname, 'src/models'),
    '@pages': require('path').resolve(__dirname, 'src/pages'),
  },
  //di标识进入该页面需要的权限，如果不需要则设置id为[]
  routes: [
    {
      id: [],
      path: '/login',
      component: '../pages/login/index',
      exact: true,
    },
    {
      id: [],
      path: '/',
      // exact: true,
      component: '../layouts/index',
      routes: [
        {
          id: [0, 1, 2, 3, 4],
          path: '/order/list',
          exact: true,
          component: '../pages/order/list/index'
        },
        {
          id: [0, 1, 2, 3, 4],
          path: '/order/detail',
          exact: true,
          component: '../pages/order/detail/index'
        },

        {
          id: [],
          path: '/changepassword',
          component: '../pages/user/changepassword/index',
          exact: true,
        },

        {
          // id: [],
          path: '/401',
          component: '../pages/error/401/index',
        },
        {
          id: [],
          component: '../pages/error/404/index'
        },
      ],
    },
  ],
  hash: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true
      },
      locale: {
        default: 'zh-CN',
      },
      dynamicImport: { webpackChunkName: true },
      title: config.name,
      dll: true,
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
          /pages\/login2/, // 隐藏扫码登录，二期打开
        ],
      },
    }],
  ],
  proxy: {
    '/api': {
      target: config.requestURL,
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    },
  }
}
