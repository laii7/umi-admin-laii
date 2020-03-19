import modelExtend from "dva-model-extend";
import { config } from "@config";

const model = {
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

// 列表数据表格基类
const listModel = modelExtend(model, {
  name:'common',
  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: config.pageSize
    }
  },
  reducers: {
    querySuccess (state, { payload }) {
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      };
    },
    resetQuery (state, { payload = {} }) {
      return {
        ...state,
        list: [],
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条`,
          current: 1,
          total: 0,
          pageSize: config.pageSize
        }
      };
    }
  }
});

export { model, listModel };
