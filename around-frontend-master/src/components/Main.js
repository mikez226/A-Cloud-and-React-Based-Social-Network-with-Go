import React from 'react';
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import {Redirect, Switch, Route} from "react-router-dom"

function Main(props) {
  const { isLoggedIn, handleLoggedIn } = props;

  const showLogin = () => {         // when user logged in, url don't change, only the state (isLoggedIn) has been changed.
                                    // And this function change url based on this changed state.
    // case1: already logged in --> home
    // case2: hasn't logged in --> login
    return isLoggedIn
      ?
      <Redirect to="/home"/>
      :
      <Login handleLoggedIn={handleLoggedIn}/>
  }

  const showHome = () => {
    // case1: already logged in --> home
    // case2: hasn't logged in --> login
    return isLoggedIn
      ?
      <Home/>
      :
      <Redirect to="/login"/>
  }

  return (
    // Route负责路由切换
    // Switch负责只显示一个完全匹配项
    <div className="main">
      <Switch>
        <Route path="/login" render={showLogin}/>
        <Route path="/register" component={Register}/>
        <Route path="/" render={showHome}/>
      </Switch>
    </div>
  );
}

export default Main;
