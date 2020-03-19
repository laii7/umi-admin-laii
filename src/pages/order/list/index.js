import React from "react";
import { routerRedux } from "dva/router";
import queryString from "query-string";
import PropTypes from "prop-types";
import List from "./List";
import Filter from "./Filter";
import styles from '../styles.less';
import Statistic from './Statistic';
import Page from "@components/Page";

import { connect } from 'dva';

const OrderList = ({ location, dispatch, order, loading }) => {
  const { search, pathname } = location;
  let query = queryString.parse(search);
  const { list, pagination,summary } = order;
  const handleRefresh = newQuery => {
    dispatch(
      routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          ...newQuery
        })
      })
    );
  };

  const filterProps = {
    filter: {
      ...query
    },
    onFilterChange: value => {
      handleRefresh({
        page: 1,
        ...query,
        ...value,
      });
    },
    handleReset: () => { },
  };
  const listProps = {
    dataSource: list,
    pagination,
    bordered: true,
    size: 'small',
    loading: loading.effects["order/queryPolicyList"],
    // 分页、排序、筛选变化时触发
    onChange (page) {
      handleRefresh({
        page_size: page.pageSize,
        page: page.current,
      });
    },
    onDetail (policy_id = '') {
      dispatch(routerRedux.push({
        pathname: '/order/detail',
        search: queryString.stringify({ policy_id }),
      }
      ))
    }
  };


  return (
    <Page inner>
      <Statistic summary={summary} />
      <br />
      <Filter {...filterProps} />
      <div className={styles.totle_data}>
        <p>合计保费：{order.total_paid_amount}</p>
        <p style={{ marginLeft: 20 }}>有效保单数：{pagination.total}</p>
      </div>
      <List {...listProps} />
    </Page>
  );
};

OrderList.propTypes = {
  order: PropTypes.object
}


export default connect(({ order, loading }) => ({ order, loading }))(OrderList);
