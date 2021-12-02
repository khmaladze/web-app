import React, { useEffect, useState, useContext, useRef } from "react";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Conversations from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import "./messenger.css";
import { UserContext } from "../../App";
import axios from "axios";
import { io } from "socket.io-client";

function Messenger() {
  const { state, dispatch } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const [user, setUser] = useState("");
  const [go, setGo] = useState("");
  const scrollRef = useRef();
  const [current, setCurrent] = useState("");

  useEffect(() => {
    if (state) {
      setCurrent(state._id);
    }
  }, [current]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
      console.log(data);
    });
  }, []);

  useEffect(() => {
    if (arrivalMessage && currentChat) {
      arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (user) {
      socket.current.emit("addUser", user);
      socket.current.on("getUsers", (users) => {
        console.log(users);
      });
    }
  }, [user]);

  useEffect(() => {
    setUser(state?._id);
    if (user) {
      const getConversations = async () => {
        try {
          const res = await axios.get("/api/conversations/" + user);
          setConversations(res.data);
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getConversations();
    }
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/api/messages/" + currentChat?._id);
        setMessages(res.data);
        console.log("get message");
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (current) {
      console.log(current);
      console.log(newMessage);
      console.log(currentChat._id);
      const message = {
        sender: current,
        text: newMessage,
        conversationId: currentChat._id,
      };
      if (message) {
        console.log(message);
      }
      const receiverId = currentChat.members.find(
        (member) => member !== current
      );
      socket.current.emit("sendMessage", {
        senderId: current,
        receiverId,
        text: newMessage,
      });

      try {
        const res = await axios.post("/api/messages", message);
        setMessages([...messages, res.data]);
        setNewMessage("");
        setGo(true);
        console.log("message sent");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversations conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              {currentChat ? (
                <>
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user} />
                    </div>
                  ))}
                </>
              ) : (
                <span className="noConversationText">
                  Open a conversation to start a chat
                </span>
              )}
            </div>
            <div className="chatBoxBottom">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="chatMessageInput"
                placeholder="text message..."
              ></textarea>
              <button className="chatSubmitButton" onClick={handleSubmit}>
                send
              </button>
            </div>
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
