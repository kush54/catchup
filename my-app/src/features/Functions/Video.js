import React, { useCallback, useEffect, useState, useRef } from "react";
import { socket } from "../socket/Socket";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  selectAllMessages,
  selectAllUsers,
  selectUserId,
  setAllMessages,
} from "./helpSlice";
import { NavigationType, useNavigate } from "react-router-dom";
import peer from "./Peer";
import ReactPlayer from "react-player";
import "./video.css";

const Video = () => {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [ms, setMs] = useState(null);
  const [rs, setRs] = useState(null);
  const [rec, setRec] = useState(null);
  const userId = useSelector(selectUserId);
  const onlineUsers = useSelector(selectAllUsers);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const newVideo = useCallback(() => {
    peer.initializePeer();
    socket.emit("pairing-user-video", userId, (error) => {
      return error;
    });

    socket.on("user-paired", async ({ rid, type }) => {
      setRec(rid);
      if (type === "call") {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMs(stream);

        const offer = await peer.getOffer();
        console.log(offer, "creakjjkted-offer");
        socket.emit("user:call", { to: rid, offer });
      }
    });

    socket.on("user-call", async ({ from, offer }) => {
      console.log(offer, "got-offer");
      setRec(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setMs(stream);
      console.log("bheje", offer);
      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans: answer });
    });

    socket.on("call-accept", async (answer) => {
      console.log(answer, "cretaed-answer");
      await peer.setLocalDescription(answer);
    });

    return () => {
      socket.off("user-paired");
      socket.off("user-call");
      socket.off("call-accept");
    };
  }, []);

  useEffect(() => {
    const trackEventListener = (ev) => {
      const remoteStream = ev.streams[0];
      console.log("Got remote tracks", remoteStream);
      setRs(remoteStream);
    };

    if (peer.peer && peer.peer !== null) {
      peer.peer.addEventListener("track", trackEventListener);
    }

    return () => {
      if (peer.peer && peer.peer !== null) {
        peer.peer.removeEventListener("track", trackEventListener);
      }
    };
  }, [rs, peer.peer]);

  useEffect(() => {
    if (userId && onlineUsers.find((user) => user.id === userId)) {
      newVideo();
    } else {
      navigate("/");
    }
  }, []);

  const handleNegotiation = useCallback(async () => {
    console.log("Negotiation needed");
    const offer = await peer.getOffer();
    console.log(offer, "nego offer cretaed");
    socket.emit("peer:nego:needed", { offer, to: rec });
  }, [rec]);

  useEffect(() => {
    {
      peer.peer &&
        peer.peer.addEventListener("negotiationneeded", handleNegotiation);
    }
    return () => {
      {
        peer.peer &&
          peer.peer.removeEventListener("negotiationneeded", handleNegotiation);
      }
    };
  }, [handleNegotiation]);

  const handleFinalNego = useCallback(async ({ from, ans }) => {
    await peer.setLocalDescription(ans);
    // helpStream()
  });

  useEffect(() => {
    socket.on("peer:nego:needed", async ({ from, offer }) => {
      console.log("Received negotiation needed");
      console.log(from, offer);
      const answer = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans: answer });
    });

    socket.on("peer:nego:done", async ({ from, ans }) => {
      console.log("Negotiation done", ans);
      await peer.setRemoteDescription(ans);
    });

    socket.on("peer:nego:final", handleFinalNego);

    return () => {
      socket.off("peer:nego:needed");
      socket.off("peer:nego:done");
      socket.off("peer:nego:final");
    };
  }, [rec]);

  const helpStream = useCallback(() => {
    if (ms) {
      for (const track of ms.getTracks()) {
        peer.peer.addTrack(track, ms);
      }
    }
  }, [ms]);

  // useEffect(()=>{
  //   if(ms && peer.peer){
  //     console.log("chahha")
  //     for (const track of ms.getTracks()) {
  //       peer.peer.addTrack(track, ms);
  //     }
  //   }
  // },[ms])

  // .....................................................chat....................................................
  const [message, setMessage] = useState(null);
  const chatBoxRef = useRef(null);
  const allMessages = useSelector(selectAllMessages);

  const handleClick = () => {
    dispatch(setAllMessages({ message: message, type: "you" }));
    socket.emit("send-message", { rec, message });
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (message?.length === 0) {
      return;
    }
    if (e.key === "Enter") {
      dispatch(setAllMessages({ message: message, type: "you" }));
      socket.emit("send-message", { reciever: rec, message });
      setMessage("");
    }
  };

  useEffect(() => {
    console.log("chla");
    socket.on("send-message", (message) => {
      dispatch(setAllMessages({ message: message, type: "stranger" }));
      setMessage(null);
    });
    return () => {
      socket.off("send-message");
    };
  }, [dispatch]);

  const handleStop = () => {
    // setStop(true);
    if (rec) {
      socket.emit("chat-close", rec, () => {
        return {};
      });
      peer.closeConnection();
      setRec(null);
      setRs(null);
      setMs(null);

      dispatch(setAllMessages({ type: "end" }));
    } else {
      socket.emit("unpairing-user-video", userId, () => {});
    }
    // navigate("/")
  };

  const handleCam = () => {
    setCam(!cam);
  };

  useEffect(() => {
    socket.on("chat-close", () => {
      // setStop(true);
      peer.closeConnection();
      setRec(null);
      dispatch(setAllMessages({ type: "end" }));
      setMessage("");
      setMs(null);
      setRs(null);
    });
    return () => {
      socket.off("chat-close");
    };
  }, [dispatch]);
  console.log(cam);
  return (
    <>
      <div className="sec">
        <div className="vc">
          <div className="vc1">
            <ReactPlayer
              className="player"
              playing
              height="100%"
              width="100%"
              url={rs}
            />
          </div>
          <div className="vc2">
            <ReactPlayer
              playing
              height="100%"
              width="100%"
              url={ms}
              className="help"
            />
          </div>
        </div>

        <div className="chat">
          <div className="buttons">
            <button className="stop" onClick={handleStop}>
              Stop
            </button>
            <button className="new" onClick={newVideo}>
              New
            </button>
            {/* <button className="">{rec ? "found" : "Not found"}</button> */}
            <button
              className={`connected ${ms ? "con" : "ncon"}`}
              onClick={helpStream}
            >
              {ms ? "call" : "Not-connected"}
            </button>
          </div>

          <div className="mchat" ref={chatBoxRef}>
            <h1>Chat</h1>
            {allMessages.map((mess, index) => (
              <div key={index} className="flex items-start justify-start mb-4">
                <div className="rounded-lg p-4 max-w-xs">
                  <p
                    className={`${
                      mess.type === "you" ? "text-black" : "text-black"
                    } m-auto`}
                  >
                    {mess.type}
                  </p>
                  <p
                    className={`text-xl font-bold font-serif ${
                      mess.type === "you" ? "text-black" : "text-black"
                    }`}
                  >
                    {mess.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="type">
            <input
              style={{ backgroundColor: "lightpink", borderRadius: "20px" }}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e)}
              ref={chatBoxRef}
              // placeholder="Type a message..."
              className="input"
            />
            <button onClick={handleClick} className="send">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
