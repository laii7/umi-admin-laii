
import { post } from "@utils/request";

export function onChangePassword (params) {
  return post({
    url: "/api/user/password/update",
    data: params
  });
}