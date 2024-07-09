import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket/Socket";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllMessages,
  selectAllUsers,
  selectRecuever,
  selectUserId,
  setAllMessages,
  setReceiver
} from "./helpSlice";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(selectUserId);
  const onlineUsers = useSelector(selectAllUsers);
  const reciever = useSelector(selectRecuever);
  const [message, setMessage] = useState("");
  const allMessages = useSelector(selectAllMessages);
  const [stop, setStop] = useState(false);
  const chatBoxRef = useRef(null);

  const newChat = () => {
    setStop(false);
    console.log(userId,socket.id,"check")
    socket.emit("pairing-user", userId, (error) => {
      return error;
    });

    socket.on("user-paired", (recieverId) => {
      dispatch(setReceiver(recieverId));
    });

    return () => {
      socket.off("user-paired");
    };
  };

  useEffect(() => {
    if (reciever !== undefined && !onlineUsers.find((user) => user.sid === reciever)) {
      dispatch(setAllMessages({ type: "end" }));
      dispatch(setReceiver(null));
    }
  }, [onlineUsers, reciever, dispatch]);

  useEffect(() => {
    console.log("upr",userId,onlineUsers)
    if (userId && onlineUsers.find((user) => user.id === userId)) {
      console.log("chla")
      newChat();
    } else {
      navigate("/");
    }
  }, []);

  const handleClick = () => {
    if (message.length === 0) {
      return;
    }
    console.log(reciever,"here")
    dispatch(setAllMessages({ message: message, type: "you" }));
    socket.emit("send-message", { reciever:reciever, message:message });
    setMessage("");
  };

  useEffect(() => {
    socket.on("send-message", (message) => {
      dispatch(setAllMessages({ message: message, type: "stranger" }));
      setMessage("");
    });
    return () => {
      socket.off("send-message");
    };
  }, [dispatch]);

  const handleStop = () => {
    setStop(true);
    if (reciever) {
      socket.emit("chat-close", reciever, () => {
        dispatch(setReceiver(null));
        dispatch(setAllMessages({ type: "end" }));
      });
    } else {
      socket.emit("unpairing-user", userId, () => {});
    }
  };

  useEffect(() => {
    socket.on("chat-close", () => {
      setStop(true);
      dispatch(setReceiver(null));
      dispatch(setAllMessages({ type: "end" }));
      setMessage("");
    });
    return () => {
      socket.off("chat-close");
    };
  }, [dispatch]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      dispatch(setAllMessages({ message: message, type: "you" }));
      socket.emit("send-message", { reciever, message });
      setMessage("");
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [allMessages]);


  return (
    <>
   <div className=" bg-sky-900 h-[600px] flex flex-col">
      <header className="bg-white shadow-md">
        {!stop ? (
          <div className="max-w-7xl mx-auto px-4 py-3">
            <h1 className={reciever ? "text-lg font-semibold text-gray-800" : "text-red-700 text-2xl font-extrabold"}>
              {reciever ? "Chat with stranger" : "Connecting someone to chat"}
            </h1>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-3">
            <h1 className="text-gray-800">Tap new to start a new conversation</h1>
          </div>
        )}
      </header>

      <div className="flex-1  overflow-y-auto px-4 py-6" ref={chatBoxRef}>
        {allMessages.map((mess, index) => (
          <div key={index} className="flex items-start justify-start mb-4">
            <div className="rounded-lg p-4 max-w-xs" >
              <p className={`${mess.type === "you" ? "text-amber-400" : "text-blue-400"} m-auto`}>{mess.type}</p>
              <p className={`text-xl font-bold font-serif ${mess.type === "you" ? "text-white" : "text-white"}`} >
                {mess.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-white border-t stick border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)} ref={chatBoxRef}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Type your message..."
           
          />
          <button
            onClick={handleClick}
            className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
          <button
            onClick={handleStop}
            className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none"
          >
            Stop
          </button>
          <button
            onClick={newChat}
            className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none"
          >
            New
          </button>
        </div>
      </div>
</>
  );
};

export default Chat;
