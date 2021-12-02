import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";

const UserProfilePage = () => {
  const { state, dispatch } = useContext(UserContext);

  const history = useHistory();

  const { id } = useParams();

  //   user profile
  const [userProfile, setProfile] = useState(null);
  const [userProfilePost, setProfilePost] = useState(null);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    fetch(`/api/main/user/@${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        setProfile(result.user);
        // setProfilePost(result.post);
      });
    fetch(`/api/main/user/post/@${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        setProfilePost(result.post);
        // setProfilePost(result.post);
      });
  }, []);
  const [showfollow, setShowFollow] = useState(false);
  useEffect(() => {
    setShowFollow(
      state
        ? !state.following.includes(userProfile ? userProfile._id : userId)
        : true
    );
  });

  useEffect(() => {
    if (userProfile) {
      setUserId(userProfile._id);
      console.log(userProfile._id);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    console.log(userId);
  }, [userId]);
  const followUser = () => {
    console.log(userId);
    fetch("/api/main/user/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userProfile._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(data.following);
        console.log(data.followers);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState,
              followers: [...prevState.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/api/main/user/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userProfile._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(data.following);
        console.log(data.followers);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
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
        const newData = userProfilePost.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setProfilePost(newData);
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
        const newData = userProfilePost.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });

        setProfilePost(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      {userProfile ? (
        <div>
          <div className="profile__container">
            <div
              className="profile__container__image"
              style={{
                backgroundImage: `url(${
                  userProfile.backgroundImage
                    ? userProfile.backgroundImage
                    : "loading"
                })`,
              }}
            ></div>

            <div
              className="profile__image"
              style={{
                backgroundImage: `url(${
                  userProfile.image ? userProfile.image : "loading"
                })`,
              }}
            ></div>

            <div className="profile__info">
              <h3>
                {userProfile.firstName} {userProfile.lastName}
              </h3>
              <h5>{userProfile.biography ? userProfile.biography : ""}</h5>
              <h5>
                username:{" "}
                {userProfile.username ? userProfile.username : "loading"}
              </h5>
              {/* <button
                style={{
                  margin: "10px",
                }}
                className="followunfollow"
                onClick={() => followUser()}
              >
                Follow
              </button> */}
              {showfollow ? (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="followunfollow"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="followunfollow"
                  onClick={() => unfollowUser()}
                >
                  UnFollow
                </button>
              )}
              <h5>posts: {userProfilePost?.length}</h5>
            </div>
          </div>
          <div className="profile__posts__container">
            {userProfilePost ? (
              userProfilePost.map((post) => {
                return (
                  <div className="profile__post__card" key={post._id}>
                    <div className="profile__post__card__header">
                      <div className="profile__post__card__header__img">
                        <img src={userProfile.image} alt="header_img" />
                      </div>
                      <div className="profile__post__card__header__info">
                        <div className="profile__post__card__header__author">
                          <h3>
                            {userProfile.firstName} {userProfile.lastName}
                          </h3>
                        </div>
                        <div className="profile__post__card__header__created__info">
                          <h3>{post.createdAt.slice(0, 10)}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="profile__post__card__content">
                      {post.text ? (
                        <div className="profile__post__card__content__text">
                          <h5>{post.text}</h5>
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
        </div>
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
  );
};

export default UserProfilePage;
