import { message } from 'antd';


export const dva = {
  config: {
    onError (err) {
      err.preventDefault();
      message.error(err.message);
      console.error(err.message);
    },
  },
};
