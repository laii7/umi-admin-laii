# 项目信息

    名称：umi-admin-laii
    作者：laii7
    邮箱：535654314@qq.com

## 安装步骤

    npm install         // 安装项目依赖，等待安装完成之后

## 本地开发

    // 开启服务器，浏览器访问 http://localhost:8000
    npm start

## 构建生产

    // 执行构建命令，生成的dist文件夹放在服务器下即可访问
    npm build

## 项目结构

    - dist //项目打包出来的静态文件夹（用户服务器部署）
    - mock  //项目前端生产批量生产数据（暂时没用上）
    - node_modules    //项目依赖
    - public  //公共资源
    - src //项目主要代码目录
        - assets //静态资源
        - components  //公共组件及基础组件
        - layouts   //基础布局容器（app）
        - models    //redux全局共享状态数据流model
        - pages    // 前端页面
        - services  //请求服务
        - utils     //项目工具包
    -static    // 全局静态文件
    .umirc.js  // umi配置文件，可以配置umi的一些框架特性以及webpack、本次项目采用配置式路由开发，新增的路由需要在此文件显示声明路由（整合权限）

    -webpack.config.js  //webpack配置文件(非真实，只是为了兼容警告)

## 推荐使用 yarn 管理

    npm install -g yarn
