import React, { forwardRef } from "react";
import { Form, Upload, Input } from "antd";
import { InboxOutlined } from "@ant-design/icons";
// 用forwardRef包裹了以后，就可以接受props和formRef了（和class component不一样）
export const PostForm = forwardRef((props, formRef) => {
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    // message & dragger
    // ref = {refInstance => {CreatePostButton.postFOrm = refInstance}}
    <Form name="validate_other" {...formItemLayout} ref={formRef}>
      <Form.Item
        name="description"
        label="Message"
        rules={[
          {
            required: true,
            message: "Please input your message."
          }
        ]}
      >
        <Input />
      </Form.Item>

      {/*两层Form.Item: 第一层负责样式，第二层负责内容*/}
      <Form.Item label="Image/Video">
        <Form.Item
          name="uploadPost"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
        >
          {/*beforeUplaod set false, prevent auto upload*/}
          <Upload.Dragger name="files" beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>
    </Form>
  );
});
