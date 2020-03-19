import React from "react";
import { Icon } from "antd";
import Page from "@components/Page";
import { connect } from "dva";
import styles from "./index.less";


const index = ({ dispatch }) => {
  // useEffect(()=>{
    setTimeout(()=>{
      dispatch({ type: 'app/resetBteadList' })

    })
  // })
  return (
    <Page inner>
      <div className={styles.error}>
        <Icon type="frown-o" />
        <h1>404啦</h1>
        <h1>没有找到页面!</h1>
        <h1>请确认路径是否正确!</h1>
      </div>
    </Page>
  )
};

export default connect()(index);
