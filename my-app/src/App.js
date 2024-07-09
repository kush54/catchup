import React from "react";
import "./App.css";
import Socket from "./features/socket/Socket";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Home from "./features/Functions/Home";
import Chat from "./features/Functions/Chat";
import Video from "./features/Functions/Video";
import Vid from "./features/Functions/Vid";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home></Home>,
    },
    {
      path: "/chat",
      element: <Chat></Chat>,
    },
    {
      path: "/video",
      element: <Video></Video>
    },
    {
      path: "/vid",
      element: <Vid></Vid>
    },
    
  ]);

  return (
    <>
    <Socket/>
    <div className="App">
      
      <RouterProvider router={router} />
    </div>
    </>
  );
}

export default App;
