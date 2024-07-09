import React from 'react'
import { useSelector } from 'react-redux'
import { selectMs, selectRs } from './helpSlice'
import ReactPlayer from "react-player";


const Vid = () => {
  const ms = useSelector(selectMs)
  const rs = useSelector(selectRs)
  return (
    <div className='flex flex-col h-screen'>
          <div id="video-container" class="flex flex-1 justify-between p-5 bg-gray-100">
        <div class="video-box w-1/2 h-full bg-gray-300 flex items-center justify-center border border-gray-400 rounded-lg overflow-hidden mr-2">
        <ReactPlayer
          className="video"
          playing
          muted
          height="600px"
          width="600px"
          url={ms}
        />
        </div>
        <div class="video-box w-1/2 h-full bg-gray-300 flex items-center justify-center border border-gray-400 rounded-lg overflow-hidden ml-2">
        <ReactPlayer
          className="video"
          playing
          muted
          height="600px"
          width="600px"
          url={rs}
        />        </div>
    </div>
    <div id="chat-container" class="h-64 bg-white border-t border-gray-400 flex flex-col">
        <div id="messages" class="flex-1 overflow-y-auto p-3 border-b border-gray-400">
        </div>
        <div id="input-container" class="flex p-3">
            <input type="text" id="chat-input" class="flex-1 p-2 border border-gray-400 rounded-lg" placeholder="Type a message..."/>
            <button class="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onclick="sendMessage()">Send</button>
        </div>
    </div>
    </div>
  )
}

export default Vid