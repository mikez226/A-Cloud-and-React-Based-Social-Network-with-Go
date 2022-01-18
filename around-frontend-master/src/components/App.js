import React, { useState } from "react"
import '../styles/App.css';
import TopBar from "./TopBar";
import Main from "./Main"
import {TOKEN_KEY} from "../constants"

function App() {
  // App component is the Lowest Common Ancestor of TopBar and Login
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem(TOKEN_KEY) ? true : false);
  const onLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false); // trigger a rerender.
  }
  const handleLoggedIn = token => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setIsLoggedIn(true);
    }
  }

  return (
    <div className="App">
      <TopBar isLoggedIn={isLoggedIn} onLogout={onLogout}/>
      <Main isLoggedIn={isLoggedIn} handleLoggedIn={handleLoggedIn}/>
    </div>
  );
}


export default App;
