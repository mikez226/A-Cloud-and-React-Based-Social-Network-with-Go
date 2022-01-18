import React from 'react';
import {Form, Input, Button, message} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom"
import axios from "axios"

import {BASE_URL} from "../constants"


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 16,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

function Login(props) {
  const { handleLoggedIn } = props;

  const onFinish = values => {
    // step1: collect data
    console.log('Received values of form: ', values);
    const { username, password } = values;

    const opt = {
      method: "POST",                   // GET 意味着通过 URI 来识别资源。 所以我在后端设计的登陆方法是POST而不是GET。
      url: `${BASE_URL}/signin`,
      data: {
        username: username,
        password: password
      },
      headers: { "Content-TYpe": "application/json" }
    };

    // step2: make request
    axios(opt)
      .then(res => {
        if (res.status === 200) {
          const { data: token } = res; // 这个值是后端给我的token，应该传递给App
          handleLoggedIn(token);
          message.success("Login succeed!");
        }
      })
      .catch(err => {
        console.error("login failed: ", err.message);
        message.error("Login failed!");
      })
  };

  return (
    <Form
      {...formItemLayout}
      name="normal_login"
      onFinish={onFinish}
      className="login-form"
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!'
          }
          ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!'
          }
          ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" className="login-btn">
          Log in
        </Button>
      </Form.Item>
      Or <Link to="/register">register now!</Link>
    </Form>
  );
}

export default Login;
