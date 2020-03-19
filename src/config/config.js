module.exports = {
  requestURL:
    process.env.NODE_ENV === "production"
      ? "/"                           //请求的生产URL
      : "https://qcadmin.qsebao.com", //开发url
  downloadURL: process.env.NODE_ENV === "production" ? "/" : "/",  //下载URL

  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  name: "umi-admin-laii",
  footerText: "底部声明",
  pageSize: 10,
  // 需要全屏遮罩的页面(modele产生的effects))
  showLoadingList: [
    'user/queryChannelConfig', //示例
  ],
  //全局不需要权限的页面
  allow: [
    '/permission-deny',
    '/error',
    '/login'
  ],

  noAuth: [
    '/api/auth/login',
    '/api/auth/status',
    '/api/auth/request',
    '/api/auth/refresh'
  
  ], //不需要认证的请求url

  // 版本号
  version: '1.0.0'
};
