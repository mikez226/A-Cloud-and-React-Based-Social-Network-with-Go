import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

import { BASE_URL } from "../constants";

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

function Register(props) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // step1: collect data
    console.log("Received values of form: ", values);
    const { username, password } = values;
    const opt = {
      method: "POST",
      url: `${BASE_URL}/signup`,
      data: {
        username: username,
        password: password
      },
      headers: { "content-type": "application/json" }
    };

    // step2: make request
    axios(opt)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          message.success("Registration succeed!");
          props.history.push("/login");               // we use history object here to switch to login page.
        }
      })
      .catch((error) => {
        console.log("register failed: ", error.message);
        message.error("Registration failed!");
      });
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      className="register-form"
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: "Please input your Username!"
          },
          () => ({
            validator(rule, value) {
              if (value === "ma_yaowei") {
                return Promise.reject("Goodbye Yaowei!");
              }
              return Promise.resolve();
            }
          })
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!"
          }
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[    // ! rules: an array of objects & callbacks
          {
            required: true,
            message: "Please confirm your password!"
          },
          ({ getFieldValue }) => ({   // ! parameter gives me a lot of methods, we only need getFieldValue method.
            validator(rule, value) {  // ! return a validator function where we can return a Promise
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
            }
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" className="register-btn">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Register;
