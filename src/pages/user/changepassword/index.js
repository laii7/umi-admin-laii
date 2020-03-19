import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Input, Modal, message } from "antd";
import styles from "../user.less";
import { connect } from "dva";
import Page from "@components/Page";

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
}

const ChangePassword = ({
  dispatch,
  form: {
    getFieldDecorator,
    resetFields,
    getFieldsValue,
    getFieldValue,
    validateFields
  }
}) => {
  const handleSubmit = () => {
    const fields = getFieldsValue();
    validateFields((err, values) => {
      if (err) {
        return;
      } else {
        Modal.confirm({
          title: "确定要修改密码？",
          okText: '确认',
          cancelText: '取消',
          onOk () {
            dispatch({
              type: "user/changepassword",
              payload: {
                old_password: fields.old,
                new_password: fields.new
              }
            }).then((res) => {
              resetFields();
              message.success('密码修改成功！请重新登录！')
              dispatch({ type: 'app/logout' })

            });
          },
          onCancel () { }
        });
      }
    });
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue("new")) {
      callback("两次密码不一致！");
    } else {
      callback();
    }
  };

  return (
    <Page inner>
      <div className={styles.form_container}>
        <form className={styles.form}>

            <FormItem {...formLayout} hasFeedback label="旧密码">
              {getFieldDecorator("old", {
                rules: [
                  {
                    required: true,
                    message: "请输入旧密码"
                  }
                ],
                getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
              })(<Input type="password" placeholder="旧密码" />)}
            </FormItem>
  

          <FormItem {...formLayout} hasFeedback label="新密码">
            {getFieldDecorator("new", {
              rules: [
                {
                  required: true,
                  message: "请输入新密码"
                }
              ],
              getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
            })(<Input type="password" placeholder="新密码" />)}
          </FormItem>
          <FormItem {...formLayout} hasFeedback label="重复新密码">
            {getFieldDecorator("re_new", {
              rules: [
                {
                  required: true,
                  message: "请再次输入新密码"
                },

                {
                  validator: compareToFirstPassword
                }
              ],
              getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
            })(<Input type="password" placeholder="重复新密码" />)}
          </FormItem>
          <FormItem  {...formLayout} label=" " colon={false}>
            <div className={styles.btnBox}>
              <Button type="primary" onClick={handleSubmit} style={{ width: '60%' }}>
                确认
            </Button>
              <Button onClick={() => resetFields()} style={{ width: '30%' }}>清空</Button>
            </div>
          </FormItem>
        </form>
      </div>
    </Page>
  );
};

ChangePassword.prototypes = {
  form: PropTypes.func
};
export default connect(({ user }) => ({ user }))(Form.create()(ChangePassword));
