// import { get} from "@utils/request";


// 获取本人权限(不需要权限可不用理会)
export function getMyPermission (params) {

  return new Promise(resolve=>{
    resolve({data: 0})
  })
  // return get({
  //   url: "/qcapi/api/subAccountPermission",
  //   data: params
  // });
}
