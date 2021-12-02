import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const RegisterPage = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const uploadFields = () => {
    // convert Date to dd/mm/yyyy format
    let validDate = `${birthDay.slice(8, 10)}-${birthDay.slice(
      5,
      7
    )}-${birthDay.slice(0, 4)}`;

    fetch("/api/auth/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        birthDay: validDate,
        username,
        password,
        confirmPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "red-alert" });
        } else {
          M.toast({ html: data.message, classes: "green-alert" });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const PostData = () => {
    uploadFields();
  };

  return (
    <div className="auth-card-center">
      <div className="auth-card w">
        <h2>Newly</h2>
        <input
          type="text"
          placeholder="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="date"
          min="1950-01-01"
          max="2010-12-31"
          value={birthDay}
          onChange={(e) => setBirthDay(e.target.value)}
        />
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password "
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="signupbutton" onClick={() => PostData()}>
          REGISTER
        </button>
        <h5>
          <Link to="/login">Already have an account ?</Link>
        </h5>
        <h3 className="mobile-signin" style={{ marginTop: "5px" }}>
          <Link to="/">Home Page</Link>
        </h3>
      </div>
    </div>
  );
};

export default RegisterPage;
