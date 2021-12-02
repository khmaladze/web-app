import axios from "axios";
import React, { useEffect, useState } from "react";
import "./conversation.css";

function Conversations({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // console.log(conversation);
    const friendId = conversation.members.find((m) => m !== currentUser);
    const getUser = async () => {
      try {
        const res = await axios("/api/main/getuser?userId=" + friendId);
        setUser(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={user?.image}
        alt="conversationimg"
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}

export default Conversations;
