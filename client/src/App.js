import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { reducer, initialState } from "./reducers/userReducer";
import NavBar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
// import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import DotRing from "./components/DotRing/DotRing";
import UserProfilePage from "./pages/UserProfilePage";
import StorieUpload from "./pages/StorieUpload";
import Messenger from "./pages/messenger/Messenger";
import UserHomePage from "./pages/UserHomePage";
import GuestHomePage from "./pages/GuestHomePage";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      if (history.location.pathname.startsWith("/profile")) {
        history.push("/profile");
      }

      if (history.location.pathname.startsWith("/login")) {
        history.push("/");
      }

      dispatch({ type: "USER", payload: user });
    } else {
      if (history.location.pathname.startsWith("/login")) {
        history.push("/login");
      }

      if (history.location.pathname.startsWith("/register")) {
        history.push("/register");
      }

      if (history.location.pathname.startsWith("/profile")) {
        history.push("/");
      }

      if (history.location.pathname.startsWith("/user")) {
        history.push("/");
      }

      if (history.location.pathname.startsWith("/post")) {
        history.push("/");
      }
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        {state ? <UserHomePage /> : <GuestHomePage />}
      </Route>
      <Route exact path="/register">
        <RegisterPage />
      </Route>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/profile">
        <ProfilePage />
      </Route>
      <Route exact path="/user/@:id">
        <UserProfilePage />
      </Route>
      <Route exact path="/user/upload/storie">
        <StorieUpload />
      </Route>
      <Route exact path="/messenger">
        <Messenger />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <DotRing />
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
