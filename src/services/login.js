import { post,get } from "@utils/request";
import queryString from "query-string";

// 登录
export function loginByPassword(params) {
  return post({
    url: "/api/auth/login",
    data: params
  });
}


// 刷新token
export async function refreshToken(params) {
  await get({
    url: "/api/auth/refresh",
    data: params
  }).then(({data})=>{
    localStorage.setItem('USER_AUTH', queryString.stringify({
      access_token: data.access_token,
      expire_at: data.expire_at
    }))
    localStorage.setItem('USER_INFO', queryString.stringify(
      data.user_data
    ))
  })
 
}