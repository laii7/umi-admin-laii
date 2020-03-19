import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Row, Divider, Skeleton } from "antd";
import styles from '../styles.less';

const Statistic = ({ summary }) => {
  const { premiums, policy_counts } = summary
  const done = premiums.hasOwnProperty('today') && premiums.hasOwnProperty('yesterday') && premiums.hasOwnProperty('this_month') && policy_counts.hasOwnProperty('this_month');
  return (
    <Skeleton loading={!done} active>
      <Card title="业绩统计"  >
        <Row type="flex" >
          <Col span={6}>
            <div className={styles.statistic_item}>
              <h4>{summary.premiums.today || 0} 元</h4>
              <p>今日新增保费（元）</p>
            </div>
          </Col>
          <Col span={1}>
            <Divider type="vertical" style={{ height: '100%' }} />
          </Col>
          <Col span={5}>
            <div className={styles.statistic_item}>
              <h4>{summary.premiums.yesterday || 0} 元</h4>
              <p>昨日新增保费（元）</p>
            </div>
          </Col>
          <Col span={1}>
            <Divider type="vertical" style={{ height: '100%' }} />
          </Col>
          <Col span={5}>
            <div className={styles.statistic_item}>
              <h4>{summary.premiums.this_month || 0} 元</h4>
              <p>本月累计保费（元）</p>
            </div>
          </Col>
          <Col span={1}>
            <Divider type="vertical" style={{ height: '100%' }} />
          </Col>
          <Col span={5}>
            <div className={styles.statistic_item}>
              <h4>{summary.policy_counts.this_month || 0} 件</h4>
              <p>本月累计成单数（件）</p>
            </div>
          </Col>
        </Row>
      </Card>
    </Skeleton>
  )
}

Statistic.propTypes = {
  summary: PropTypes.object
}

export default Statistic;