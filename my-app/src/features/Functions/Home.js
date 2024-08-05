import React, { useEffect } from 'react'
import "./Home.css"
import { Link, Navigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../socket/Socket';
import { useDispatch, useSelector } from 'react-redux';
import { selectRecuever, selectUserId, userId } from './helpSlice';

const Home = () => {
     const dispatch  = useDispatch()
     const rec = useSelector(selectRecuever)
      console.log(rec)
  
  return (
    <>
    {rec && <Navigate to='/chat'  replace={true} />}
   <div className='bgig min-h-screen flex justify-center items-center'>
     <div className='flex justify-center items-center'>
             <div className="max-w-lg mx-auto  p-8 rounded-lg text">
        <h1 className="text-3xl text-center mb-8">Welcome to our Website</h1>
        <div className="flex justify-center mb-8 space-x-4">
            <Link to="/video"><button className=" text-pi border-4   hover:bg-pink-600 font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out">Video</button></Link>
           <Link to="/chat"> <button className="  border-4 hover:bg-pink-600 font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out">Chat</button></Link>
        </div>
        <p className="text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel leo auctor, cursus nunc vel, blandit dui.</p>
    </div> 
    </div> 
   </div>
   </>
  )
}

export default Home