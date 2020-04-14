
import * as userService from "@services/user";

const {
  onChangePassword,
} = userService;

export default {
  namespace: 'user',
  state: {

  },
  subscriptions: {
    setup ({ dispatch, history, loading }) {
      history.listen(location => {
        // const { pathname } = location;
      })
    }
  },

  effects: {
    // 修改密码
    *changepassword ({ payload = {} }, { call, put }) {
      yield call(onChangePassword, payload);
    },
  },
  reducers: {

  },
};