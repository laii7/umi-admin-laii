import React from "react";
import { connect } from "dva";
import Page from "@components/Page";
import PolicyStatus from '@components/policy/policyStatus/PolicyStatus';
import { Descriptions, Button, Card } from 'antd';
import { goback } from '@utils/utils';
import styles from '../styles.less';

const Detail = ({ order }) => {
  const { detail } = order;
  return (
    <Page inner>
      {
        // detail.id ?
        <div>
          <Descriptions title="基本信息" style={{ border: '1px solid #e8e8e8', padding: 20 }} column={3} size="default" >
            <Descriptions.Item label="产品名称">{detail.insurance_name}</Descriptions.Item>
            <Descriptions.Item label="保单号">{detail.policy_no}</Descriptions.Item>
            <Descriptions.Item label="状态"><PolicyStatus status={detail.status * 1} /></Descriptions.Item>

            <Descriptions.Item label="投保时间">{detail.insured_at}</Descriptions.Item>
            <Descriptions.Item label="生效时间">{detail.start_at}</Descriptions.Item>
            <Descriptions.Item label="保费">{detail.premium}</Descriptions.Item>

            <Descriptions.Item label="缴费期">{detail.pay_period}</Descriptions.Item>
            <Descriptions.Item label="保障期">{detail.policy_period}</Descriptions.Item>
            <Descriptions.Item label="投保人手机号">{detail.phone}</Descriptions.Item>
          </Descriptions>

          <Descriptions title="投保人" style={{ border: '1px solid #e8e8e8', marginTop: 10, padding: 20 }} column={2} size="default" >
            <Descriptions.Item label="投保人姓名">{detail.applicant.name}</Descriptions.Item>
            <Descriptions.Item label="投保人身份证号">{detail.applicant.idcard}</Descriptions.Item>
          </Descriptions>

          <Card
            style={{ marginTop: 20 }}
            // bordered={false}
            headStyle={{ borderBottom: 'none' }}
            bodyStyle={{ padding: 0 }}
            title="被保人">

            {
              detail.insureds && detail.insureds.map((item, index) => (
                <Descriptions style={{ padding: 20 }} column={2} size="default" key={index} >
                  <Descriptions.Item label={`被保人${index + 1}姓名`} >{item.name}</Descriptions.Item>
                  <Descriptions.Item label={`被保人${index + 1}身份证`}>{item.idcard}</Descriptions.Item>
                </Descriptions>
              ))
            }


          </Card>

          <div className={styles.detail_bottom}>
            <Button style={{ width: 200 }} onClick={() => goback()}>返回</Button>
          </div>

        </div>
        // :
        // <Error />
      }


    </Page >

  )
}


export default connect(({ order, loading }) => ({ order, loading }))(Detail);