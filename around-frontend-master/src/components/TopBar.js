import React from 'react';
import logo from "../assets/images/logo.svg"
import { LogoutOutlined } from "@ant-design/icons"

function TopBar(props) {
  const {isLoggedIn, onLogout} = props;
  return (
    <div>
      <header className="TopBar-header">
        <img src={logo} className="TopBar-logo" alt="logo" />
        <span className="TopBar-title">
          Around Web
        </span>
        { isLoggedIn
          ?
          <LogoutOutlined className="TopBar-logout"
                          onClick={onLogout}
          />
          :
          null
        }
      </header>
    </div>
  );
}

export default TopBar;
