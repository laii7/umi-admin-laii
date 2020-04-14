import * as loginService from "@services/login";
import queryString from "query-string";
import { routerRedux } from "dva/router";
import { verifyToken } from '@utils/utils';


const { loginByPassword } = loginService;

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

export default {
  namespace: "login",
  state: {},
  subscriptions: {
    setup ({ dispatch, history }) {
      dispatch({ type: 'queryListen' }).then(isListen => {
        if (!isListen) {
          dispatch({ type: 'app/changeListen' })
          history.listen(location => {
            const { pathname } = location;
            if (pathname !== '/login') {
              verifyToken().then(res => {
                if (res) {
                  dispatch({ type: "app/checkRouter", payload: pathname })
                }
              }).then(() => {
                dispatch({ type: "app/resetBteadList" });
                dispatch({ type: "app/siderSlected" });
              });
            }
          })
        }
      })

    },
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
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("userinfo", userinfo);

      yield put({ type: 'app/queryPermission' });

      yield call(delay, 1000);

      yield put(routerRedux.push("/order/list"));
      yield put({ type: "app/siderSlected" });



    },

    //查询是否已在app做过全局路由监听
    *queryListen ({ payload = {} }, { call, put, select }) {
      const isListen = yield select(({ app }) => app.isListen);
      return isListen
    }

  },
  reducers: {}
};
