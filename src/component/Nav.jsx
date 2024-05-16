import React from 'react'
import { useGlobal } from '../context'

function Nav() {
    const {spotify,setSpotify} = useGlobal()
  return (
    <div className='flex w-screen  gap-8 h-[50px] bg-white fixed z-50 bottom-0 right-0 rounded-md shadow-sm items-center justify-center ' >
      <section className={`${spotify?'text-green-500 font-[500] ':'text-black font-[400] '}`} onClick={() =>{
        setSpotify(true)
      }} >
        Spotify
      </section>
      <section className={`${!spotify?'text-red-500 font-[500] ':'text-black font-[400] '}`} onClick={() =>{
        setSpotify(false)
      }} >Youtube</section>
    </div>
  )
}

export default Nav
