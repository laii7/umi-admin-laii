import React from "react";
import { Icon } from "antd";
import  Page  from "@components/Page";
import styles from "./index.less";


const index = () => {
  return (
    <Page inner>
      <div className={styles.error}>
        <Icon type="exclamation-circle" />
        <h1>非法访问！</h1>
        <h1>没有权限访问页面！</h1>
        <h1>请联系管理员!</h1>
      </div>
    </Page>
  )
};

export default index;
