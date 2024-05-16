// export default App
import React, { useState } from "react";
import SpotifyLogin from "./Login";
import Search from "./Search";
import Youtube from "./Youtube";
import { useGlobal } from "./context";
import Nav from "./component/nav";

const App = () => {
  const {spotify,setSpotify} = useGlobal()
  return (
    <main className="relative" >
      { spotify ? <Search/>:<Youtube/> }
      <Nav/>
    </main>
  );
};
export default App;
