import * as loginService from "@services/login";
import queryString from "query-string";
import { routerRedux } from "dva/router";
import { getMyPermission } from "@services/permission";

const {loginByPassword } = loginService;
export default {
  namespace: "login",
  state: {},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === "/login") {
          if (window.localStorage.getItem("token")) {
            dispatch(routerRedux.push("/order/list"));
          }
        }
      });
    },
    setupHistory ({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: "siderSlected"
        });
      });
    }
  },
  effects: {
    // 通过账号密码登录
    *loginByPassword ({ payload = {} }, { call, put }) {
      const { data } = yield call(loginByPassword, payload);
      const token = queryString.stringify({
        token: data.access_token,
        // token_type: data.token_type,
        token_timeout: data.expire_in,
        expire_at: data.expire_in * 1000 + Date.parse(new Date()),
      });
      const userinfo = queryString.stringify(data.user_data);
      window.localStorage.setItem("userToken", data.access_token);
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("userinfo", userinfo);

      const resu = yield call(getMyPermission);
      window.localStorage.setItem('USER_TYPE', resu.data + '')

      yield put(routerRedux.push("/order/list"));

    },
  },
  reducers: {}
};
