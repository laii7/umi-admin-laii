
import mockjs from 'mockjs';

//接口返回的基类
const commData = {
  code: 0,
  msg: "OK",
  data: {}
}

export default {

  // 获取保单列表
  'GET /api/policy/list': mockjs.mock({
    ...commData,
    data: {
      'list|100': [{
        'id|1-10000': 100000000,
        provider: "信泰人寿保险",
        insurance_name: "守护神",
        applicant: "小明",
        insureds: "小明",
        premium: "3409.00",
        paid_amount: "3409.00",
        status: 3,
        start_at: "2020-03-16 00:00:00",
        end_at: "9999-12-31 23:59:59",
        'policy_no|10-100000': 200000000,
        insured_at: "2020-03-15 15:11",
      }],
      total_paid_amount: "10.00",
      total_premium: "10.00",
      count: 0,
      total_page: 0,
      current_page: 1
    }
  }),
  // 获取保单详情
  'GET /api/policy/detail': mockjs.mock({
    ...commData,
    data: {
      "insurance_name": "守护神",
      'policy_no|10-100000': 200000000,
      "status": 3,
      "insured_at": "2020-03-15 15:11:30",
      "start_at": "2020-03-16 00:00:00",
      "end_at": "9999-12-31 23:59:59",
      "premium": "3409.00",
      "pay_period": "20年",
      "policy_period": "终身",
      "phone": "180****5435",
      "applicant": {
        "name": "小明",
        "idcard": "3203231979******41",
        "phone": "180****5435"
      },
      "insureds": [
        {
          "name": "小明",
          "idcard": "3203231979******41"
        }
      ],
    }
  }),

  // 获取保单详情
  'GET /api/policy/summary': mockjs.mock({
    ...commData,
    data: {
      "premiums": {
        "today|10-100": 10,
        "yesterday|10-1000": 10,
        "this_month|10-1000": 10,
      },
      "policy_counts": {
        "this_month|1-1000": 4
      }
    }
  }),
  // 修改密码
  'POST /api/user/password/update': mockjs.mock({
    ...commData,
    data: {}
  }),

  // 登录
  'POST /api/auth/login': {
    ...commData,
    data: {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczpcL1wvcWNhZG1pbi5xc2ViYW8uY29tIiwic3ViIjpudWxsLCJpYXQiOjE1ODQ2MDkyMTgsImV4cCI6MTU4NDY5NTYxOCwibmJmIjoxNTg0NjA5MjE4LCJkYXQiOnsidXNlcl9pZCI6Mn19.3hn9OLWeoYzeVAzI7V60RLr2tSc49eLWwT_VVy86WIE",
      "expire_in": "86400",
      "user_data": {
        "name": "laii7"
      }
    }
  },

  'GET /api/subAccountPermission':{
    ...commData,
    data:0

  },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req, res) => { res.end('OK'); },
};