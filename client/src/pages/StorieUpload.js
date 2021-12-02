import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const StorieUpload = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  // for storie create
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [url, setUrl] = useState("");

  // For Post
  useEffect(() => {
    if (text && photo) {
      if (url) {
        fetch("/api/main/user/storie", {
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
    if (photo && !text) {
      if (url) {
        fetch("/api/main/user/storie", {
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
  }, [url]);

  // Create Storie
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
      fetch("/api/main/user/storie", {
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

  // Get today month and year
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  return (
    <div>
      <div className="profile__container">
        <div
          className="profile__container__image"
          style={{
            backgroundImage: `url(${
              state ? state.backgroundImage : "loading"
            })`,
          }}
        ></div>
        {/* <div className="profile__image">
          <img src={state ? state.image : "loading"} alt="profile_img" />
        </div> */}
        <div
          className="profile__image"
          style={{
            backgroundImage: `url(${state ? state.image : "loading"})`,
          }}
        ></div>
        <div className="profile__info">
          <h3>
            {state ? state.firstName : "loading"}{" "}
            {state ? state.lastName : "loading"}
          </h3>
          <h5>username: {state ? state.username : "loading"}</h5>
          <h5>following: {state ? state.following.length : "0"}</h5>
          <h5>followers: {state ? state.followers.length : " 0"}</h5>
          <h5>{state ? state.email : "loading"}</h5>
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
            <h3 style={{ textAlign: "center" }}>Create Storie</h3>
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
      </div>
    </div>
  );
};

export default StorieUpload;
