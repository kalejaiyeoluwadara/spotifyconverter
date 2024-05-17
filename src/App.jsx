// export default App
import React, { useState } from "react";
import SpotifyLogin from "./Login";
import Search from "./Search";
import Youtube from "./Youtube";
import { useGlobal } from "./context";
import Nav from "./component/Nav";
import YoutubePlaylistCreator from "./PLaylist";

const App = () => {
  const {spotify,setSpotify,page} = useGlobal()
  return (
    <main className="relative">
      {page === "spotify" && <Search />}
      {page === "youtube" && <Youtube />}
      {page === "login" && <YoutubePlaylistCreator />}
      <Nav />
    </main>
  );
};
export default App;
