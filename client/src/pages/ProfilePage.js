import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const ProfilePage = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  // const [files, setFiles] = useState([]);

  // for post create
  const [post, setPost] = useState([]);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [url, setUrl] = useState("");

  // for profileImage
  const [image, setImage] = useState("");

  // for background
  const [backgroundimg, setBackgroundimg] = useState("");

  // for following and followers data
  const [followData, setFollowData] = useState("");
  const [userData, setUserData] = useState("");

  // for biography and isFeatured update
  const [biography, setBiography] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [showProfileUpdate, setShowProfileUpdate] = useState(false);
  const [showProfileUpdatee, setShowProfileUpdatee] = useState(false);

  // for image upload
  const [showPostUpdate, setShowPostUpdate] = useState(false);
  const [updatePostId, setUpdatePostId] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [editPhoto, setEditPhoto] = useState("");

  // for biography
  const updateBiographyText = () => {
    if (biography) {
      fetch("/api/main/profile/biography", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          biography: biography,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(result);
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...state,
              biography: result.biography,
              // postauthorphoto: result.photo,
            })
          );
          dispatch({ type: "UPDATEBIOGRAPHY", payload: result.biography });
          //window.location.reload()
        });
      setShowProfileUpdate(false);
      setShowProfileUpdatee(false);
      setBiography("");
    }
  };

  const updateIsFeaturedContent = () => {
    if (isFeatured) {
      fetch("/api/main/profile/isfeatured", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          isFeatured: isFeatured,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(result);
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...state,
              isFeatured: result.isFeatured,
              // postauthorphoto: result.photo,
            })
          );
          dispatch({ type: "UPDATEISFEATURED", payload: result.isFeatured });
          //window.location.reload()
        });
      setShowProfileUpdate(false);
      setShowProfileUpdatee(false);
      setIsFeatured("");
    }
  };

  // for background
  useEffect(() => {
    if (backgroundimg) {
      const data = new FormData();
      data.append("file", backgroundimg);
      data.append(
        "upload_preset",
        "afdffasfdsgsfgfasdasasgfherhrehrehrehrhrhrhr"
      );
      data.append("cloud_name", "dtlhyd02w");
      fetch("https://api.cloudinary.com/v1_1/dtlhyd02w/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/api/main/profile/background/picture", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              backgroundImage: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              // console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...state,
                  backgroundImage: result.backgroundImage,
                  // postauthorphoto: result.photo,
                })
              );
              dispatch({
                type: "UPDATEBACKGROUNDIMG",
                payload: result.backgroundImage,
              });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [backgroundimg]);

  const updateBackground = (file) => {
    setBackgroundimg(file);
  };

  // Profile image upload
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append(
        "upload_preset",
        "afdffasfdsgsfgfasdasasgfherhrehrehrehrhrhrhr"
      );
      data.append("cloud_name", "dtlhyd02w");
      fetch("https://api.cloudinary.com/v1_1/dtlhyd02w/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/api/main/profile/picture", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              image: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              // console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...state,
                  image: result.image,
                  // postauthorphoto: result.photo,
                })
              );
              dispatch({ type: "UPDATEPIC", payload: result.image });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  // For Post
  useEffect(() => {
    if (text && photo) {
      if (url) {
        fetch("/api/post/post", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            text,
            photo: url,
            userCreatedAtLocalTime: today,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              M.toast({ html: data.error, classes: "red-alert" });
            } else {
              M.toast({
                html: "Created post Successfully",
                classes: "green-alert",
              });
              history.push("/profile");
              window.location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    if (photo && !text && !updateText) {
      // console.log(FilePond);
      // console.log(FilePond.file);
      // console.log(FilePond.files);
      // console.log(photo);
      // console.log(photo.files[0]);
      // console.log(photo.files);
      if (url) {
        fetch("/api/post/post", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            photo: url,
            userCreatedAtLocalTime: today,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              M.toast({ html: data.error, classes: "red-alert" });
            } else {
              M.toast({
                html: "Created post Successfully",
                classes: "green-alert",
              });
              history.push("/profile");
              window.location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    // FOR POST UPDATE
    if (updateText && photo) {
      if (url) {
        fetch(`/api/post/post/${updatePostId}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            text: updateText,
            photo: url,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              M.toast({ html: data.error, classes: "red-alert" });
            } else {
              M.toast({
                html: "Created post Successfully",
                classes: "green-alert",
              });
              window.location.reload();
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.push("/profile");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    if (photo && !updateText) {
      if (url) {
        fetch(`/api/post/post/${updatePostId}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            photo: url,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              M.toast({ html: data.error, classes: "red-alert" });
            } else {
              M.toast({
                html: "Created post Successfully",
                classes: "green-alert",
              });
              history.push("/profile");
              window.location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [url]);

  // Update Post
  const postUpdateDetails = (postId) => {
    if (updateText && !photo) {
      fetch(`/api/post/post/${postId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          text: updateText,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red-alert" });
          } else {
            M.toast({
              html: "Created post Successfully",
              classes: "green-alert",
            });
            history.push("/profile");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (updateText && photo) {
      const data = new FormData();
      data.append("file", photo.files[0]);
      data.append(
        "upload_preset",
        "afdffasfdsgsfgfasdasasgfherhrehrehrehrhrhrhr"
      );
      data.append("cloud_name", "dtlhyd02w");
      fetch("https://api.cloudinary.com/v1_1/dtlhyd02w/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url);
          history.push("/profile");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (photo && !updateText) {
      const data = new FormData();
      // console.log(photo);
      // console.log(photo.files);
      // console.log(photo.files[0]);
      data.append("file", photo.files[0]);
      data.append(
        "upload_preset",
        "afdffasfdsgsfgfasdasasgfherhrehrehrehrhrhrhr"
      );
      data.append("cloud_name", "dtlhyd02w");
      console.log(data);
      fetch("https://api.cloudinary.com/v1_1/dtlhyd02w/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url);
          console.log(url);
          history.push("/profile");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Create Post
  const postDetails = () => {
    if (text && photo) {
      const data = new FormData();
      data.append("file", photo.files[0]);
      data.append(
        "upload_preset",
        "afdffasfdsgsfgfasdasasgfherhrehrehrehrhrhrhr"
      );
      data.append("cloud_name", "dtlhyd02w");
      fetch("https://api.cloudinary.com/v1_1/dtlhyd02w/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url);
          history.push("/profile");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (text && !photo) {
      fetch("/api/post/post", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          text,
          userCreatedAtLocalTime: today,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red-alert" });
          } else {
            M.toast({
              html: "Created post Successfully",
              classes: "green-alert",
            });
            history.push("/profile");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (photo && !text) {
      const data = new FormData();
      // console.log(photo);
      // console.log(photo.files);
      // console.log(photo.files[0]);
      data.append("file", photo.files[0]);
      data.append(
        "upload_preset",
        "afdffasfdsgsfgfasdasasgfherhrehrehrehrhrhrhr"
      );
      data.append("cloud_name", "dtlhyd02w");
      console.log(data);
      fetch("https://api.cloudinary.com/v1_1/dtlhyd02w/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url);
          console.log(url);
          history.push("/profile");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // get user post
  useEffect(() => {
    fetch("/api/main/profile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.profilePost);
        setPost(result.profilePost);
      });
  }, []);

  // // get user following and followers data
  // useEffect(() => {
  //   if (state ? state.username : "0") {
  //     setUserData(state ? state.username : "johndoe");
  //     console.log(userData);
  //   }
  // }, [userData]);

  // get user following and followers data
  // useEffect(() => {
  //   if (userData) {
  //     fetch(`/api/main/user/get/follow/${userData}`, {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("jwt"),
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((result) => {
  //         setFollowData(result.user);
  //         console.log(followData);
  //       });
  //   }
  // }, [followData]);

  // Deletepost
  const deletePost = (id) => {
    fetch(`/api/post/post/${id}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = post.filter((item) => {
          return item._id !== result._id;
        });
        setPost(newData);
        window.location.reload();
      });
  };

  // Function show Biography
  const functionhowBiography = () => {
    if (showProfileUpdate == false) {
      setShowProfileUpdate(true);
      setShowProfileUpdatee(true);
    } else {
      setShowProfileUpdate(false);
      setShowProfileUpdatee(false);
    }
  };

  // function showUpdatePost
  const showToUpdatePost = (postId) => {
    if (showPostUpdate == false) {
      const currentPostData = document.getElementById(postId);
      const currentPostText = document.getElementById(`${postId + "1"}`);
      setShowPostUpdate(true);
      currentPostData.style.display = "none";
      if (currentPostText) {
        setUpdateText(currentPostText.textContent);
      }
      setUpdatePostId(postId);
      window.scrollTo({ top: 750, behavior: "smooth" });
    } else {
      // const currentPostData = document.getElementById(postId);
      // const currentPostText = document.getElementById(`${postId + "1"}`);
      setShowPostUpdate(false);
      setUpdateText("");
      setUpdatePostId("");
      history.push("/profile");
      window.location.reload();
    }
  };

  // Get today month and year
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

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
            const heart = document.createElement("i");
            heart.classList.add("fas");
            heart.classList.add("fa-heart");
            const x = window.pageXOffset;
            const y = window.pageYOffset;
            console.log(x, y);
            heart.style.position = "fixed";
            heart.style.top = "calc(100vh - 50%)";
            heart.style.left = "calc(100vw - 50% - 10px)";
            heart.style.fontSize = "80px";
            heart.style.height = "20px";
            heart.style.width = "20px";
            heart.style.display = "flex";
            heart.style.justifyContent = "center";
            heart.style.alignItems = "center";
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 500);
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
            const heart = document.createElement("i");
            heart.classList.add("far");
            heart.classList.add("fa-heart");
            const x = window.pageXOffset;
            const y = window.pageYOffset;
            console.log(x, y);
            heart.style.position = "fixed";
            heart.style.top = "calc(100vh - 50%)";
            heart.style.left = "calc(100vw - 50% - 10px)";
            heart.style.fontSize = "80px";
            heart.style.height = "20px";
            heart.style.width = "20px";
            heart.style.display = "flex";
            heart.style.justifyContent = "center";
            heart.style.alignItems = "center";
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 500);
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

  const createHeart = (id, status) => {
    if (status === true) {
      unlikePost(id);
    }
    if (status === false) {
      likePost(id);
    }
  };

  return (
    <div>
      <div className="image-upload">
        <label htmlFor="file-input">
          <i className="fas fa-camera"></i>
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={(e) => updateBackground(e.target.files[0])}
        />
      </div>
      <div className="image-upload">
        <label htmlFor="file-inputts">
          <i
            className="fas fa-camera"
            style={{
              position: "absolute",
              marginTop: "375px",
              marginLeft: "235px",
              fontSize: "20px",
              color: "aliceblue",
              zIndex: "1",
            }}
          ></i>
        </label>
        <input
          id="file-inputts"
          type="file"
          accept="image/*"
          onChange={(e) => updatePhoto(e.target.files[0])}
        />
      </div>
      <div className="profile__container">
        <div
          className="profile__container__image"
          style={{
            backgroundImage: `url(${
              state ? state.backgroundImage : "loading"
            })`,
          }}
        ></div>

        <div
          className="profile__image"
          style={{
            backgroundImage: `url(${state ? state.image : "loading"})`,
          }}
        ></div>

        <div>
          <i
            className="fas fa-user-edit"
            style={{
              position: "absolute",
              marginTop: "135px",
              marginLeft: "235px",
              fontSize: "20px",
              color: "black",
            }}
            onClick={functionhowBiography}
          ></i>
        </div>
        <div className="profile__info">
          <h3>
            {state ? state.firstName : "loading"}{" "}
            {state ? state.lastName : "loading"}
          </h3>
          {showProfileUpdate ? (
            <div
              className="post-button"
              style={{
                height: "50px",
                marginTop: "-0px",
                position: "relative",
                bottom: "18px",
                marginBottom: "-15px",
              }}
            >
              <input
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                type="text"
                placeholder="Enter Your Biography..."
              />
              <button
                style={{ marginTop: "18px" }}
                onClick={() => updateBiographyText()}
                type="submit"
                name="action"
              >
                update
              </button>
            </div>
          ) : state ? (
            state.biography == "" ? (
              "add bio.."
            ) : (
              state.biography
            )
          ) : (
            "loading"
          )}
          <h5>username: {state ? state.username : "loading"}</h5>
          <h5>
            following: {state ? state.following.length : "0"}
            {/* {followData
              ? followData.following
                ? followData.following.length
                : state
                ? state.following.length
                : "loading"
              : state
              ? state.following.length
              : "loading"} */}
          </h5>
          <h5>
            followers: {state ? state.followers.length : " 0"}
            {/* {followData
              ? followData.followers
                ? followData.followers.length
                : state
                ? state.followers.length
                : "loading"
              : state
              ? state.followers.length
              : "loading"} */}
          </h5>
          {showProfileUpdatee ? (
            <div
              className="post-button"
              style={{
                height: "50px",
                marginTop: "-0px",
                position: "relative",
                bottom: "18px",
                marginBottom: "-15px",
              }}
            >
              <input
                value={isFeatured}
                onChange={(e) => setIsFeatured(e.target.value)}
                type="text"
                placeholder="Enter true or false"
              />
              <button
                style={{ marginTop: "18px" }}
                onClick={() => updateIsFeaturedContent()}
                type="submit"
                name="action"
              >
                update
              </button>
            </div>
          ) : (
            <h5>
              featured: {state ? (state.isFeatured ? "yes" : "no") : "loading"}
            </h5>
          )}
          <h5>{state ? state.email : "loading"}</h5>
          <h5>posts: {post ? post.length : "loading"}</h5>
        </div>
      </div>
      <div className="profile__posts__container">
        <div className="profile__post__card">
          <div className="profile__post__card__header">
            <div className="profile__post__card__header__img">
              <img src={state ? state.image : "loading"} alt="header_img" />
            </div>
            <div className="profile__post__card__header__info">
              <div className="profile__post__card__header__author">
                <h3>
                  {state ? state.firstName : "loading"}{" "}
                  {state ? state.lastName : "loading"}
                </h3>
              </div>
              <div className="profile__post__card__header__created__info">
                <h3>{today}</h3>
              </div>
            </div>
          </div>
          <div className="profile__post__card__content">
            <div className="profile__post__card__content__text">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder=" Enter Your Text Here..."
                style={{
                  height: "200px",
                  maxHeight: "250px",
                  width: "100%",
                  maxWidth: "755px",
                  padding: "10px",
                }}
              ></textarea>
            </div>
            <div>
              <FilePond
                file={photo}
                // onupdatefiles={setPhoto}
                allowMultiple={false}
                maxFiles={1}
                value={photo}
                onupdatefiles={(fileItems) => {
                  setPhoto({
                    files: fileItems.map((fileItem) => fileItem.file),
                  });
                }}
                name="files"
                labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
              />
            </div>
          </div>
          <div
            className="post-button"
            style={{ marginTop: "0px", paddingBottom: "10px" }}
          >
            <button onClick={() => postDetails()} type="submit" name="action">
              post
            </button>
          </div>
        </div>
        {showPostUpdate ? (
          <div className="profile__post__card">
            <div className="profile__post__card__header">
              <div className="profile__post__card__header__img">
                <img src={state ? state.image : "loading"} alt="header_img" />
              </div>
              <div className="profile__post__card__header__info">
                <div className="profile__post__card__header__author">
                  <h3>
                    {state ? state.firstName : "loading"}{" "}
                    {state ? state.lastName : "loading"}
                  </h3>
                </div>
                <div className="profile__post__card__header__created__info">
                  <h3>{today}</h3>
                  <i
                    onClick={() => showToUpdatePost(post._id)}
                    className="far fa-edit"
                  ></i>
                </div>
              </div>
            </div>
            <div className="profile__post__card__content">
              <div className="profile__post__card__content__text">
                <h2>We Are Updating your Post</h2>

                <textarea
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  placeholder={updateText}
                  style={{
                    height: "200px",
                    maxHeight: "250px",
                    width: "100%",
                    maxWidth: "755px",
                    padding: "10px",
                  }}
                ></textarea>
              </div>

              <div>
                <FilePond
                  file={photo}
                  // onupdatefiles={setPhoto}
                  allowMultiple={false}
                  maxFiles={1}
                  value={photo}
                  onupdatefiles={(fileItems) => {
                    setPhoto({
                      files: fileItems.map((fileItem) => fileItem.file),
                    });
                  }}
                  name="files"
                  labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                />
              </div>
            </div>
            <div
              className="post-button"
              style={{ marginTop: "0px", paddingBottom: "10px" }}
            >
              <button
                onClick={() => postUpdateDetails(updatePostId)}
                type="submit"
                name="action"
              >
                post
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
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
                    backgroundImage: `url(${state?.image})`,
                    marginLeft: "35px",
                  }}
                >
                  {/* <img src={post.postedBy.image} alt="header_img" /> */}
                </div>

                <div className="profile__post__card__header__info">
                  <div className="profile__post__card__header__author">
                    <h3>
                      {state ? state.firstName : "loading"}{" "}
                      {state ? state.lastName : "loading"}
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
                    <i
                      onClick={() => deletePost(post._id)}
                      className="far fa-trash-alt"
                    ></i>
                    <i
                      onClick={() => showToUpdatePost(post._id)}
                      className="far fa-edit"
                    ></i>
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
                  <div
                    className="profile__post__card__content__image"
                    onClick={
                      post.likes?.includes(state._id)
                        ? () => createHeart(post._id, true)
                        : () => createHeart(post._id, false)
                    }
                  >
                    <img src={post.photo} alt="post__img" />
                  </div>
                ) : (
                  <div style={{ display: "none" }}></div>
                )}
              </div>
              <div className="profile__post__card__reacts">
                {post.likes?.includes(state._id) ? (
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
                )}
                {post.likes ? post.likes.length : "0"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilePage;
