import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { selectAllUsers, selectRecuever, setAllMessages, setAllUsers, setReceiver, userId } from "../Functions/helpSlice";
// https://u4m.vercel.app
export const socket = io("http://localhost:8000");
const Socket = () => {
  const dispatch = useDispatch();
  const rec = useSelector(selectRecuever)

  const Do = useMemo(() => {
    const id = uuidv4();
    console.log(id,socket.id);
    dispatch(userId(id));
    socket.emit("new-user", id, (error) => {
      if (error) {
        return alert(error);
      }
    });
    socket.on("get-online-users",(allUsers)=>{
      console.log(allUsers)
        dispatch(setAllUsers(allUsers))
    })
  }, [socket]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
    if (socket.id) {
      Do();
    }
    return () => {
      socket.disconnect(rec);
     
    };
  }, [Do]);

  const users = useSelector(selectAllUsers)
  console.log(users)

  return <div></div>;
};

export default Socket;
