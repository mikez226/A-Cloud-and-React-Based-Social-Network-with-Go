import React, {useState, useEffect} from 'react';
import {message, Tabs, Row, Col, Button} from 'antd';
import SearchBar from "./SearchBar"
import PhotoGallery from "./PhotoGallery";
import {BASE_URL, SEARCH_KEY, TOKEN_KEY} from "../constants"
import * as axios from "axios"
import CreatePostButton from "./CreatePostButton"
const {TabPane} = Tabs;

function Home(props) {
  const [posts, setPost] = useState([]); // 数据存在posts下面
  const [activeTab, setActiveTab] = useState("image");
  const [searchOption, setSearchOption] = useState({
    type: SEARCH_KEY.all,
    keyword: ""
  });

  function fetchPost(option) {
    // collect data
    const { type, keyword } = option;
    let url = '';

    if (type === SEARCH_KEY.all) {
      url = `${BASE_URL}/search`;
    } else if (type === SEARCH_KEY.user) {
      url = `${BASE_URL}/search?user=${keyword}`;
    } else {
      url = `${BASE_URL}/search?keywords=${keyword}`;
    }

    // make request -- carry the token
    const opt = {
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
      },

    }

    axios(opt)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setPost(res.data);
          message.success("Enjoy!");
        }
      })
      .catch((err) => {
        message.error("Fetch posts failed!");
        console.log("fetch posts failed: ", err.message);
      });

  }

  // fetch data?
  useEffect(() => {
    console.log('in effect', searchOption)
    // do search the first time -> didMount -> search: {type: all, value: ''}
    // after the first search -> didUpdate -> search: {type: keyword / user, value: value}
    const { type, keyword } = searchOption;
    fetchPost(searchOption); // fetchPost when: did mount, click all, click search button
  }, [searchOption]); // change searchOption when: click all, or click search button

  const renderPosts = (type) => {
    if (!posts || posts.length === 0) {
      return <div>No data!</div>;
    }
    if (type === "image") {
      const imageArr = posts
        .filter((item) => item.type === "image")
        .map((image) => {
          return {
            src: image.url,
            user: image.user,
            caption: image.message,
            thumbnail: image.url,
            // thumbnailWidth: 300,
            // thumbnailHeight: 200
          };
        });

      return <PhotoGallery images={imageArr} />;
    } else if (type === "video") {
      // video tab下：
      // 返回一个Row
      // Row里面，把post中video类别的filte出来，然后映射为一个Column。
      // Col要写key, 因为是重复出现的子元素，所以要给一个key，否则VirtualDOM难以识别。它们
      // Video标签要给src属性、是否可控属性、类名。（设置样式）

      return (
        <Row gutter={32}>
          {posts
            .filter((post) => post.type === "video")
            .map((post) => (
              <Col span={8} key={post.url}>
                <video src={post.url}
                       controls={true}
                       className="video-block"
                />
                <p>
                  {post.user}: {post.message}
                </p>
              </Col>
            ))}
        </Row>
      );
    }
  };

  const handleSearch = (opt) => {
    // trigger useEffect.
    const {type, keyword} = opt;
    setSearchOption({type: type, keyword: keyword});
  }

  const onShowPost = (tab) => {
    // auto rerender after an uploading.
    setActiveTab(tab);
    // 注意，不要立马进行fetch Post，要等一下下。后台虽然返回200代表存储完毕，但是还是需要
    setTimeout(() => {
      setSearchOption(prevState=>{return prevState});
    }, 1000);
  }

  const operations = <CreatePostButton onShowPost={onShowPost}/>;
  return (
    <div className="home">
      <SearchBar handleSearch={handleSearch}/>
      <div className="display">
        <Tabs
          onChange={(key) => setActiveTab(key)}
          activeKey={activeTab}
          defaultActiveKey="image"
          tabBarExtraContent={operations}
        >
          <TabPane tab="Image" key="image">
            {renderPosts("image")}
          </TabPane>
          <TabPane tab="Video" key="video">
            {renderPosts("video")}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Home;
