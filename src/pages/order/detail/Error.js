import React from "react";
import { Result, Button } from 'antd';
import { goback } from '@utils/utils';
const Error = () => {
  return (
    <div style={{ marginTop: 150 }}>
      <Result
        status="error"
        title="保单不存在"
        subTitle="保单查找失败，请确认检索条件是否正确!"
        extra={[
          <Button style={{ width: 200 }} key={1} onClick={() => goback()}>返回</Button>
        ]}
      />
    </div>
  )
}
export default Error