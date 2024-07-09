import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  allUsers: [],
  allMessages:[],
  status: "idle",
  remoteStream:null,
  myStream:null,
  reciever:null,
  ms:null,
  rs:null
};

export const helpSlice = createSlice({
  name: "help",
  initialState,
  reducers: {
    userId: (state, action) => {
      state.id = action.payload;
    },
    setAllUsers: (state, action) => {
      console.log(action.payload);
      state.allUsers = action.payload;
    },
    setAllMessages:(state,action)=>{
      if(action.payload.type==="end"){
        state.allMessages=[]
      }else{
        state.allMessages.push(action.payload)
      }
    },
    setMyStream:(state,action)=>{
       state.myStream = action.payload
    },
    setRemoteStream:(state,action)=>{
      state.remoteStream=action.payload
    },
    setReceiver:(state,action)=>{
      state.reciever=action.payload
    },
    setMs:(state,action)=>{
      state.ms=action.payload
    },
    setRs:(state,action)=>{
      state.rs=action.payload
    }
  },

  extraReducers: (builder) => {},
});

export const { userId, setAllUsers,setAllMessages,setMyStream,setRemoteStream,setReceiver,setMs,setRs } = helpSlice.actions;

// export const selectCount = (state) => state.counter.value;

export const selectUserId = (state) => state.help.id;
export const selectAllUsers = (state) => state.help.allUsers;
export const selectAllMessages = (state)=>state.help.allMessages
export const selectMystream = (state)=>state.help.myStream
export const selectRemoteStream = (state)=>state.help.remoteStream
export const selectRecuever = (state)=>state.help.reciever
export const selectMs = (state)=>state.help.ms
export const selectRs = (state)=>state.help.rs

export default helpSlice.reducer;






 {/* {ms && <div> My stream</div>}
      {ms && (
        <ReactPlayer
          className="video"
          playing
          muted
          height="600px"
          width="600px"
          url={ms}
        />
      )}
      {rs && <div> Remote stream</div>} */}
      {/* {ms && helpStream} */}
      {/* <button onClick={helpStream} class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"></button> */}

      {/* {rs && (
        <ReactPlayer
          className="video rotate-180"
          playing
          muted
          height="600px"
          width="600px"
          url={rs}
        />
      )} */}
