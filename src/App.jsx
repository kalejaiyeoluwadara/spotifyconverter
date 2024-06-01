// export default App
import React, { useState } from "react";
import SpotifyLogin from "./Login";
import Search from "./Search";
import Youtube from "./Youtube";
import { useGlobal } from "./context";
import Nav from "./component/Nav";
import YoutubePlaylistCreator from "./PLaylist";
import Playlist from "./Fetch";
import Limit from "./component/Modal";

const App = () => {
  const { spotify, setSpotify, page, modal, setModal } = useGlobal();
  return (
    <main className="relative overflow-x-hidden ">
      {page === "spotify" && <Search />}
      {page === "youtube" && <Youtube />}
      {page === "login" && <YoutubePlaylistCreator />}
      {page === "playlist" && <Playlist />}
      <Nav />
    </main>
  );
};
export default App;
