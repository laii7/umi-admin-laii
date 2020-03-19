import * as orderService from "@services/order";
import queryString from "query-string";
import { listModel } from "@models/common";
import modelExtend from "dva-model-extend";
import { config } from "@config";
import moment from "moment";

const dateFormat = 'YYYY-MM-DD';
const {
  getPolicySumary,
  getPolicyList,
  getPolicyDetail
} = orderService;

export default modelExtend(listModel, {
  namespace: "order",
  state: {
    summary: {
      premiums: {},
      policy_counts: {},

    },
    detail: {
      applicant: {},
      insureds: [],
      cparams: [],
    },
    total_paid_amount: 0,
    count: 0,

  },
  subscriptions: {
    setup ({ dispatch, history, loading }) {
      history.listen(location => {
        let payload = queryString.parse(location.search);
        const { pathname } = location;
        switch (pathname) {
          case '/order/list':
            if (!payload.start_at) {
              payload = {
                ...payload,
                start_at: moment(new Date()).subtract(1, 'months').format(dateFormat),
                end_at: moment(new Date()).format(dateFormat)
              }
            }
            dispatch({ type: 'queryPolicySumary' });
            dispatch({ type: 'queryPolicyList', payload });
            break;
          case '/order/detail':
            dispatch({
              type: 'app/setBreadList', payload: [{
                icon: "",
                text: "订单详情"
              }]
            })
            dispatch({ type: 'queryPolicyDetail', payload });
            break;
          default:
            break;
        }
      })
    }
  },
  effects: {
    // 查询统计数据
    *queryPolicySumary ({ payload = {} }, { call, put }) {
      const { data } = yield call(getPolicySumary, payload);
      yield put({ type: 'updateSummary', payload: data });
    },
    // 查询保单详情
    *queryPolicyDetail ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateDetail', payload: {
          applicant: {},
          insureds: [],
          cparams: [],
        }
      });
      const { data } = yield call(getPolicyDetail, payload);
      yield put({ type: 'updateDetail', payload: data });
    },


    // 查询订单列表
    *queryPolicyList ({ payload = {} }, { call, put }) {
      const { data } = yield call(getPolicyList, payload);
      yield put({
        type: 'querySuccess',
        payload: {
          list: data.list,
          pagination: {
            current: Number(payload.page) || 1,
            pageSize: Number(payload.page_size) || config.pageSize,
            total: Number(data.count)
          }
        }
      });
      yield put({ type: 'updateTotal', payload: { total_paid_amount: data.total_paid_amount } })
    },


  },
  reducers: {
    updateSummary (state, { payload }) {
      return {
        ...state,
        summary: payload
      }
    },
    updateTotal (state, { payload }) {
      return {
        ...state,
        total_paid_amount: payload.total_paid_amount,
        total_premium: payload.total_premium
      }
    },


    updateDetail (state, { payload }) {
      return {
        ...state,
        detail: payload
      }
    }
  }
});
