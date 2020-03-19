import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";

const PolicyStatus = ({ status }) => {
  switch (status) {
    case 0:
      return <Tag color="orange">待支付</Tag>
    case 1:
      return <Tag color="blue">已支付</Tag>
    case 2:
      return <Tag color="#2db7f5">待生效</Tag>
    case 3:
      return <Tag color="green">已生效</Tag>
    case 4:
      return <Tag color="gray">已过期</Tag>
    case 5:
      return <Tag color="green">已续保</Tag>
    case 6:
      return <Tag color="red">已退保</Tag>
    case 7:
      return <Tag color="red">投保失败</Tag>
    case 8:
      return <Tag color="gold">宽限期</Tag>
    default:
      return <Tag color="gray">状态不明</Tag>
  }
}
PolicyStatus.propTypes = {
  status: PropTypes.number
}
export default PolicyStatus;