import { get } from "@utils/request";

// 获取统计数据
export function getPolicySumary (params) {
  return get({
    url: "/api/policy/summary",
    data: params
  });
}
// 获取订单列表
export function getPolicyList (params) {
  return get({
    url: "/api/policy/list",
    data: params
  });
}
// 获取订单详情
export function getPolicyDetail (params) {
  return get({
    url: "/api/policy/detail",
    data: params
  });
}
