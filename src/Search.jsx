import React, { useState, useEffect } from "react";

const CLIENT_ID = "21fa13dee5a54da78be93d4db02485b7";
const CLIENT_SECRET = "804c5ddb54084b66817823648dd78cf7";

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [playlistInput, setPlaylistInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((response) => response.json())
      .then((data) => {
        setAccessToken(data.access_token);
      })
      .catch((error) => console.error("Error fetching access token:", error));
  }, []);

  const searchAlbums = () => {
    const searchParameters = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=album`,
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        setAlbums(data.albums.items);
      })
      .catch((error) => console.error("Error searching for albums:", error));
  };

  const fetchPlaylist = () => {
    const playlistId = playlistInput.split("/").pop().split("?")[0]; // Extract playlist ID from URL
    const playlistParameters = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      playlistParameters
    )
      .then((response) => response.json())
      .then((data) => {
        setPlaylistTracks(data.tracks.items);
      })
      .catch((error) => console.error("Error fetching playlist:", error));
  };

  return (
    <main className="flex h-screen flex-col w-screen justify-start">
      <div className="w-screen flex items-center py-8 h-[100px] justify-center">
        <input
          placeholder="Search for artist"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={searchAlbums}
          className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Search
        </button>
      </div>
      <div className="w-screen flex items-center py-8 h-[100px] justify-center">
        <input
          placeholder="Enter playlist link"
          value={playlistInput}
          onChange={(e) => setPlaylistInput(e.target.value)}
          type="text"
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={fetchPlaylist}
          className="ml-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Get Playlist
        </button>
      </div>
      {/* Albums */}
      <main className="cards flex w-screen px-[20%] items-center justify-start flex-wrap">
        {albums.map((album) => (
          <div
            key={album.id}
            className="card w-[200px] flex flex-col items-center justify-center h-[200px] bg-white shadow-md rounded-md m-4"
          >
            <img
              src={album.images[0]?.url}
              alt={album.name}
              className="w-full h-full object-cover rounded-md"
            />
            <p className="title font-[500] text-[16px] mt-2">{album.name}</p>
          </div>
        ))}
      </main>
      {/* Playlist Tracks */}
      <main className="cards flex w-screen px-[20%] items-center justify-start flex-wrap">
        {playlistTracks.map(({ track }) => (
          <div
            key={track.id}
            className="card w-full flex items-center justify-start h-[80px] bg-white shadow-md rounded-md m-2 p-4"
          >
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-[50px] h-[50px] object-cover rounded-md"
            />
            <div className="ml-4">
              <p className="title font-[500] text-[16px]">{track.name}</p>
              <p className="text-gray-500 text-[14px]">
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </main>
    </main>
  );
}

export default Search;
