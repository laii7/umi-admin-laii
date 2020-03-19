import React from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { Button, Row, Form, Input } from "antd";
import { config } from "@config";
import styles from "./index.less";


const FormItem = Form.Item;

const Login = ({
  loading,
  dispatch,
  form: { getFieldDecorator, validateFieldsAndScroll }
}) => {
  const handleOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({ type: "login/loginByPassword", payload: values });
    });
  }
  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt="" src={require('@assets/images/qb_icon.png')} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator("username", {
            rules: [
              {
                required: true,
                message: "用户名不能为空"
              }
            ],
            getValueFromEvent: event => event.target.value.replace(/\s+/g, '')
          })(<Input onPressEnter={handleOk} placeholder="用户名" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "密码不能为空"
              }
            ],
            getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
          })(
            <Input type="password" onPressEnter={handleOk} placeholder="密码" />
          )}
        </FormItem>
        <Row>
          <Button
            type="primary"
            onClick={handleOk}
            loading={loading.effects.login}
          >
            登录
          </Button>
        </Row>
      </form>
    </div>
  );
};

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
};

export default connect(({ loading }) => ({ loading }))(Form.create()(Login));
