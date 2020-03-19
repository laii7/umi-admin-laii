import React from "react";
import PropTypes from "prop-types";
import { Table, Button } from "antd";
import PolicyStatus from '@components/policy/policyStatus/PolicyStatus';
const List = ({ onDetail, location, ...listProps }) => {
  const columns = [
    {
      title: "产品名",
      dataIndex: "insurance_name",
    },
    {
      title: "保单号",
      dataIndex: "policy_no",
    },
    {
      title: "投保时间",
      dataIndex: "insured_at",
    },
    {
      title: "投保人",
      dataIndex: "applicant",
    },

    {
      title: "被保人",
      dataIndex: "insureds",
    },

    {
      title: "状态",
      dataIndex: "status",
      render: (test, { status }) => {
        return <PolicyStatus status={status * 1} />
      }
    },
    {
      title: "保费收入",
      dataIndex: "paid_amount",
      // render: (test, { paid_amount }) => {
      //   return <p>{paid_amount && paid_amount / 100}</p>
      // }
    },

    {
      title: "操作",
      key: "operation",
      fixed: "right",
      width: 80,
      align: 'center',
      render: (test, record) => {
        const {
          id, status
        } = record;
        return (status !== 0 && <div>
          <Button type="link" onClick={onDetail.bind(null, id)}>详情</Button>
        </div>
        );
      }
    }
  ];
  return (
    <div>
      <Table {...listProps
      }
        bordered
        size="small"
        scroll={{ x: 1050 }}
        columns={
          columns
        }
        simple rowKey="id" />
    </div>);
};

List.propTypes = {
  listProps: PropTypes.object,
  onDetail: PropTypes.func
}


export default List
