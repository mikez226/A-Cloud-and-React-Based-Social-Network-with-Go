import React, {useState} from 'react';
import {Modal, Button, message} from 'antd';
import { PostForm } from "./PostForm"
import axios from "axios"
import {BASE_URL, TOKEN_KEY} from "../constants"

function CreatePostButton(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  let postForm = null;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setConfirmLoading(true);
    // step1: get info about message / image / video (from Upload event)
    // step2: check file type: image / video
    // step3: prepare image/video data and send to the server.
    postForm.validateFields()
      .then(form => {
        const { description, uploadPost } = form;
        const { type, originFileObj } = uploadPost[0];
        const postType = type.match(/^(image|video)/g)[0];
        if (postType) {
          let formData = new FormData();
          formData.append("message", description);
          formData.append("media_file", originFileObj);

          const opt = {
            method: "POST",
            url: `${BASE_URL}/upload`,
            headers: {
              Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
            data: formData
          }

          axios(opt)
            .then((res) => {
              if (res.status === 200) {
                message.success("The image/video is uploaded!");
                postForm.resetFields();  // reset the post form
                handleCancel();          // call the cancel callback
                props.onShowPost(postType); // postType --> Tab
                setConfirmLoading({ confirmLoading: false });
              }
            })
            .catch((err) => {
              console.log("Upload image/video failed: ", err.message);
              message.error("Failed to upload image/video!");
              setConfirmLoading({ confirmLoading: false });
            });
        }
      })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create New Post
      </Button>
      <Modal title="Create New Post"
             confirmLoading={confirmLoading}
             visible={isModalVisible}
             onOk={handleOk}
             onCancel={handleCancel}>
        <PostForm ref={ refInstance => {postForm = refInstance}}/>
      </Modal>
    </>
  );
}

export default CreatePostButton;
