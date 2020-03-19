import React from "react";
import Header from "@components/common/Header";
import Sider from "@components/common/Sider";
import { withRouter } from "dva/router";
import { connect } from "dva";
import Loader from "@components/Loader";
import "./index.less";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { message, Breadcrumb, Icon } from "antd";
import { showLoadingList } from '@config/config';
let currHref = "";

const BasicLayout = ({ children, dispatch, app, loading, location }) => {
  
  const { breadList, collapsed } = app;
  // 当前url不为登录时
  if (window.location.pathname.indexOf("login") > -1) {
    return (
      <div>
        <Loader fullScreen spinning={loading.effects["app/query"]} />
        {children}
      </div>
    );
  }
  const headerProps = {
    logOut () {
      dispatch({ type: "app/logout" }).then(() => {
        message.success("注销成功!");
      });
    }
  };
  const href = window.location.href; // 浏览器地址栏中地址
  if (currHref !== href) {

    // currHref 和 href 不一致时说明进行了页面跳转
    NProgress.start(); // 页面开始加载时调用 start 方法
    if (!loading.global) {
      // loading.global 为 false 时表示加载完毕
      NProgress.done(); // 页面请求完毕时调用 done 方法
      currHref = href; // 将新页面的 href 值赋值给 currHref
    }
  }

  // 从config里面遍历需要全屏遮罩的effect
  const isLoading = () => {
    let flag = false;
    showLoadingList.forEach(item => {
      if (loading.effects[item]) {
        flag = true;
      }
    });
    return flag;
  }

  return (
    <div className="body-content">
      <Loader fullScreen spinning={loading.effects["app/query"]} />
      <Header {...headerProps} />
      <Sider />
      <div className={!collapsed ? "content" : "collapse"} nihao={[]}>
        {
          breadList &&
          <Breadcrumb style={{ marginTop: 3, marginBottom: 0 }}>
            {breadList.map(item => (
              <Breadcrumb.Item key={item.text}>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.text}</span>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        }
        {/* <div className="content-loading"></div> */}
        {/* loading.effects["plan/queryDetail"] */}

        <Loader fullScreen={false} spinning={loading.global && isLoading()} loading={loading} />
        {children}
      </div>
      {/* <Bottom/> */}
    </div>
  );
};

export default withRouter(
  connect(({ app, loading }) => ({ app, loading }))(BasicLayout)
);
