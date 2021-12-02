import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
const LoginPage = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");
  const PostData = () => {
    fetch("/api/auth/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        if (data.error) {
          M.toast({ html: data.error, classes: "red-alert" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: "LOG IN SUCCESS", classes: "green-alert" });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="auth-card-center">
      <div className="auth-card">
        <h2>Newly</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPasword(e.target.value)}
        />
        <button className="signinbutton" onClick={() => PostData()}>
          LOG IN
        </button>
        <h5>
          <Link to="/register">Dont have an account ?</Link>
        </h5>
        <h6>
          <Link to="/reset">Forgot password ?</Link>
        </h6>
        <div>
          <h3 className="mobile-signin" style={{ marginTop: "10px" }}>
            <Link to="/">Home Page</Link>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
