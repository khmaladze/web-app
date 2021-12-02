import React from "react";
import { Link } from "react-router-dom";
import bg from "../assets/bg.jpg";
import logo from "../assets/logo.png";
import Typewriter from "typewriter-effect";

const Hero = () => {
  return (
    <div key="1">
      <div key="2">
        <div className="home-container mobiledevice">
          <div className="mobilephone">
            <div className="mobile"></div>
            <div className="mobileinputs">
              <div className="signin__input">
                <button>LOG IN</button>
              </div>
              <div className="signup__input">
                <button>REGISTER</button>
              </div>
            </div>
            <img className="bg" src={bg} alt="background" />
            <img className="mobile-logo" src={logo} alt="logo" />
          </div>
          <div className="welcome-text">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("UPLOAD IMAGES, FOLLOW USER LIKE & COMMENT ")
                  .start();
              }}
              options={{
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
      </div>
      <div key="3" className="mobile-container-main">
        <div className="home-mobile-container">
          <div className="logo-mobile-m-center">
            <img className="mobile-logo-center" src={logo} alt="logo" />
          </div>
          <div className="m-mobile-signin-signup-buttons">
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
        </div>
      </div>
    </div>
  );
};

export default Hero;
