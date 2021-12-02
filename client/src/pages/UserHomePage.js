import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import LocalQuote from "../components/LocalQuote";
import { UserContext } from "../App";

const UserHomePage = () => {
  const [isFeatured, setIsFeatured] = useState(false);
  const [stories, setStories] = useState([]);
  const [showStorie, setShowStorie] = useState(false);
  const [getStorie, setGetStorie] = useState("");
  const [storieid, setGetstorieid] = useState("");
  const [getStorieId, setGetStorieId] = useState("");
  const [post, setPost] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  // get user post
  useEffect(() => {
    fetch("/api/main/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.profilePost);
        setPost(result.post);
        console.log(result.post);
      });
  }, []);

  function onClickPanel() {
    const panels = document.querySelectorAll(".panel");
    panels.forEach((panel) => {
      panel.addEventListener("click", () => {
        removeActiveClasses();
        panel.classList.add("active");
      });
    });
    function removeActiveClasses() {
      panels.forEach((panel) => {
        panel.classList.remove("active");
      });
    }
  }

  // get all stories
  useEffect(() => {
    fetch("/api/main/allstorie", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setStories(result.storie);
        // console.log(result.storie)
      });
  }, []);

  // get featured users
  useEffect(() => {
    fetch("/api/main/user/featured", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(isFeatured);
        setIsFeatured(result.user);
      });
  }, []);

  onClickPanel();

  useEffect(() => {
    if (getStorieId) {
      console.log(getStorieId);
      fetch(`/api/main/storie/${getStorieId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(isFeatured);
          setGetStorie(result.storie);
          console.log(getStorie);
          // console.log(result);
          // console.log(getStorie);
          setGetstorieid(getStorieId);
          setGetStorieId("");
        });
    }
    // console.log(getStorie.map((item) => item.text)[0]);
  }, [getStorieId, getStorie]);

  const openStorie = (storieId) => {
    if (storieid == storieId) {
      setShowStorie(false);
      // console.log(storieId);
      setGetStorieId("");
      setGetStorie("");
    } else {
      setShowStorie(true);
      // console.log(storieId);
      setGetStorieId(storieId);
    }
  };

  const likePost = (id) => {
    fetch("/api/main/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = post.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPost(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/api/main/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = post.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPost(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1 className="main-text-discover">Stories</h1>
      <div className="user-stories">
        <div className="stories-container">
          {stories.slice(0, 8).map((storie) => {
            return (
              <div
                className="storie-wrap"
                key={storie._id}
                onClick={() => openStorie(storie._id)}
              >
                {/* <img src={storie.postedBy.image} alt="userphoto" /> */}
                <div
                  style={{
                    height: "80px",
                    width: "80px",
                    margin: "1%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "5px solid white",
                    borderRadius: "80px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${storie.postedBy.image})`,
                  }}
                ></div>
                <h6>{storie.postedBy.username}</h6>
                <div className="fullscreen-storie" style={{ display: "none" }}>
                  {storie.text ? (
                    <div className="post-text">
                      {" "}
                      <h5>{storie.text}</h5>
                    </div>
                  ) : (
                    <div style={{ height: "0px", display: "none" }}></div>
                  )}
                  <div className="post-card-content-photo ">
                    {storie.photo ? (
                      <img
                        style={{ cursor: "pointer" }}
                        src={storie.photo}
                        alt=""
                      />
                    ) : (
                      <img style={{ height: "0px", display: "none" }} alt="" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showStorie ? (
        <div>
          {getStorie ? (
            getStorie.map((item) => {
              return (
                <div
                  key={item._id}
                  style={{
                    width: "90%",
                    height: "500px",
                    margin: "0 auto",
                    display: "grid",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px solid",
                    background: "linear-gradient(180deg, #00c2ff, #01158b)",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ background: "white" }}>
                    {item.text ? item.text : ""}
                  </h3>
                  {item.photo ? (
                    <img
                      style={{ maxWidth: "400px" }}
                      src={item.photo}
                      alt="storieImage"
                    />
                  ) : (
                    <div
                      style={{
                        height: "100vh",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <div class="lds-dual-ring"></div> */}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div
              style={{
                height: "100vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div class="lds-dual-ring"></div>
            </div>
          )}
        </div>
      ) : (
        // <h1>{getStorie ? getStorie.map((item) => item.text)[0] : "0"}</h1>
        ""
      )}
      <LocalQuote />
      <h1 className="main-text-discover">Discover People</h1>
      <div className="container-panel">
        {isFeatured ? (
          isFeatured.map((user) => {
            return (
              <div
                key={user._id}
                className="panel"
                onClick={onClickPanel}
                style={{
                  backgroundImage: `url(${user.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h3>{user.firstName}</h3>
                <h3 style={{ marginLeft: "70px" }}>{user.lastName}</h3>
                <button
                  className="isFeatured-button"
                  type="submit"
                  style={{
                    width: "90px",
                    height: "30px",
                    border: "0.1px solid black",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontFamily: " 'Raleway' sans-serif",
                    position: "absolute",
                    bottom: "20px",
                    left: "170px",
                  }}
                >
                  <Link to={`user/@${user.username}`}>@{user.username}</Link>
                </button>
                {/* <img src={user.backgroundImage} alt="asdf" /> */}
              </div>
            );
          })
        ) : (
          <div>
            {/* <div
              className="panel"
              onClick={onClickPanel}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1612966809559-dac0bed38b6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60')",
              }}
            >
              <h3>random image</h3>
            </div>
            <div
              className="panel"
              onClick={onClickPanel}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1621349337086-f4187372d31c?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDI1fGJvOGpRS1RhRTBZfHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')",
              }}
            >
              <h3>random image</h3>
            </div>
            <div
              className="panel active"
              onClick={onClickPanel}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1609964729554-a02fb2a04830?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=701&q=80')",
              }}
            >
              <h3>random image</h3>
            </div>
            <div
              className="panel"
              onClick={onClickPanel}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1616864202496-503224fff0a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80')",
              }}
            >
              <h3>random image</h3>
            </div>
            <div
              className="panel"
              onClick={onClickPanel}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1587161584760-f51779fb276a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80')",
              }}
            >
              <h3>random image</h3>
            </div> */}
          </div>
        )}
      </div>
      <div className="profile__posts__container">
        {post.map((post) => {
          return (
            <div className="profile__post__card" id={post._id} key={post._id}>
              <div className="profile__post__card__header">
                <div
                  className="profile__post__card__header__img"
                  style={{
                    height: "52px",
                    width: "52px",
                    margin: "1%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid white",
                    borderRadius: "80px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${post.postedBy.image})`,
                    marginLeft: "35px",
                  }}
                >
                  {/* <img src={post.postedBy.image} alt="header_img" /> */}
                </div>
                <div className="profile__post__card__header__info">
                  <div className="profile__post__card__header__author">
                    <h3>
                      {post.postedBy.firstName} {post.postedBy.lastName}
                    </h3>
                  </div>
                  <div className="profile__post__card__header__created__info">
                    <h3>
                      {post.userCreatedAtLocalTime
                        ? post.userCreatedAtLocalTime
                        : post.createdAt
                        ? post.createdAt.slice(0, 10)
                        : "loading"}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="profile__post__card__content">
                {post.text ? (
                  <div className="profile__post__card__content__text">
                    <h5 id={post._id + "1"}>{post.text}</h5>
                  </div>
                ) : (
                  <div style={{ display: "none" }}></div>
                )}
                {post.photo ? (
                  <div className="profile__post__card__content__image">
                    <img src={post.photo} alt="post__img" />
                  </div>
                ) : (
                  <div style={{ display: "none" }}></div>
                )}
              </div>
              <div className="profile__post__card__reacts">
                {post.likes ? (
                  post.likes.includes(state._id) ? (
                    <i
                      style={{ cursor: "pointer" }}
                      className="fas fa-heart"
                      onClick={() => {
                        unlikePost(post._id);
                      }}
                    ></i>
                  ) : (
                    <i
                      style={{ cursor: "pointer" }}
                      className="far fa-heart"
                      onClick={() => {
                        likePost(post._id);
                      }}
                    ></i>
                  )
                ) : (
                  <i
                    style={{ cursor: "pointer" }}
                    className="far fa-heart"
                    onClick={() => {
                      likePost(post._id);
                    }}
                  ></i>
                )}
                {post.likes ? post.likes.length : "0"}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default UserHomePage;
