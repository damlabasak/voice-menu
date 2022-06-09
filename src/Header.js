import React from "react";
import "./Header.css";
import logo from './images/logo.png';
import { useHistory } from "react-router-dom";

const Header = () => {
  const history = useHistory();

  return (
    <div className="header">
      <div className="logo">
        <a href="/">
        <img
          src={logo}
          alt="logo"
        />
        </a>
      </div>
    </div>
  );
};

export default Header;
