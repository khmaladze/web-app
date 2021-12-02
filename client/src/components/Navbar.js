import React, { useContext } from "react";
import logo from "../assets/logo.png";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <div key="1">
          <header key="2">
            <nav key="3">
              <div className="navbar-logo">
                <Link to={"/"}>
                  <img src={logo} alt="logoo" />
                </Link>
              </div>
              <div className="inputss">
                <div className="signin__inputt">
                  <Link to={"/user/upload/storie"}>
                    <button>UPLOAD</button>
                  </Link>
                </div>
                <div className="signin__inputt">
                  <Link to={"/profile"}>
                    <button>PROFILE</button>
                  </Link>
                </div>
                <div className="signup__inputt">
                  <button
                    onClick={() => {
                      localStorage.clear();
                      dispatch({ type: "CLEAR" });
                      history.push("/");
                    }}
                  >
                    SIGN OUT
                  </button>
                </div>
              </div>
            </nav>
          </header>
        </div>,
      ];
    } else {
      return [
        <div key="1">
          <header key="2">
            <nav key="3">
              <div className="navbar-logo">
                <Link to={"/"}>
                  <img src={logo} alt="logoo" />
                </Link>
              </div>
              <div className="inputs">
                <div className="signin__input">
                  <Link to={"/login"}>
                    <button>LOG IN</button>
                  </Link>
                </div>
                <div className="signup__input">
                  <Link to={"/register"}>
                    <button>REGISTER</button>
                  </Link>
                </div>
              </div>
            </nav>
          </header>
        </div>,
      ];
    }
  };

  return <div>{renderList()}</div>;
};

export default NavBar;
