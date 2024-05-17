import React from 'react'
import { useGlobal } from '../context'

function Nav() {
    const {spotify,setSpotify,setPage,page} = useGlobal()
  return (
    <div className="flex w-screen  gap-8 h-[50px] bg-white fixed z-50 bottom-0 left-0 rounded-md shadow-sm items-center justify-center ">
      <section
        className={`${
          page === "spotify"
            ? "text-green-500 font-[500]  "
            : "text-black font-[400] cursor-pointer "
        }`}
        onClick={() => {
          setPage("spotify");
        }}
      >
        Spotify
      </section>
      <section
        className={`${
          page === "youtube"
            ? "text-red-500 font-[500]  "
            : "text-black font-[400] cursor-pointer "
        }`}
        onClick={() => {
          setPage("youtube");
        }}
      >
        Youtube
      </section>
      <section
        className={`${
          page === "login"
            ? "text-blue-500 font-[500]  "
            : "text-black font-[400] cursor-pointer "
        }`}
        onClick={() => {
          setPage("login");
        }}
      >
        Login
      </section>
    </div>
  );
}

export default Nav
