import React, { useState, useEffect } from "react";
import { useGlobal } from "./context";
// Spotify credentials
const CLIENT_ID = "21fa13dee5a54da78be93d4db02485b7";
const CLIENT_SECRET = "804c5ddb54084b66817823648dd78cf7";

function Search() {
  const [playlistInput, setPlaylistInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { songs, setSongs } = useGlobal();
  // Once page loads an access token is generated
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
      .catch((error) => {
        console.error("Error fetching access token:", error);
        setErrorMessage("Failed to fetch access token.");
      });
  }, []);
  // Function to songs in youtube playlist
  const fetchPlaylist = () => {
    setIsLoading(true);
    setErrorMessage("");

    const playlistId = playlistInput.split("/").pop().split("?")[0]; // Extract playlist ID from URL
    const playlistParameters = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      playlistParameters
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error.message);
        }

        const newSongs = data.items.map(({ track }) => ({
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
        }));

        // Filter out songs that already exist in the songs state
        const uniqueNewSongs = newSongs.filter((newSong) => {
          return !songs.some((song) => {
            return (
              song.name === newSong.name &&
              JSON.stringify(song.artists) === JSON.stringify(newSong.artists)
            );
          });
        });

        // Replace songs state with unique new songs
        setSongs((prevSongs) => [...uniqueNewSongs]);
        setPlaylistTracks(data.items);
        setIsLoading(false);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error fetching playlist:", error);
        setErrorMessage(
          "Failed to fetch playlist. Please check the playlist link and try again."
        );
        setIsLoading(false);
      });
  };

  return (
    <main className="flex min-h-screen bg-black text-white flex-col w-screen justify-start">
      <div className="w-full sm:px-0 px-4  flex sm:flex-row flex-col items-center py-8 h-[100px] justify-center">
        <input
          placeholder="Enter playlist link"
          value={playlistInput}
          onChange={(e) => setPlaylistInput(e.target.value)}
          type="text"
          className="py-2 px-3 border sm:w-[60%] w-[90%] text-black  sm:mt-0 mt-20 border-gray-300 rounded-[20px]"
        />
        <button
          onClick={fetchPlaylist}
          className="ml-4 px-4 py-2 sm:mt-0 mt-6 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Playlist"}
        </button>
      </div>
      {/* Error Message */}
      {errorMessage && (
        <div className="w-full sm:px-0 sm:mt-0 mt-20  px-4 sm:h-full h-screen flex items-center justify-center text-red-500">
          {errorMessage}
        </div>
      )}
      {/* Prompt Message */}
      {playlistTracks.length === 0 && !isLoading && !errorMessage && (
        <div className="w-full sm:h-full h-full sm:mt-0 mt-20 sm:px-0 px-4 flex items-center justify-center sm:text-start text-center text-gray-500">
          Please enter a Spotify playlist link to fetch tracks.
        </div>
      )}
      {/* Playlist Tracks */}
      <main className="cards mt-8 pb-20 flex w-screen sm:px-[20%] px-0 items-center justify-start flex-wrap">
        {playlistTracks.map(({ track }) => (
          <div
            key={track.id}
            className="card w-full transition-all hover:scale-105 flex items-center justify-start h-[80px] bg-gray-900 shadow-md rounded-md m-2 sm:p-4 p-1 "
          >
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-[50px] h-[50px] object-cover rounded-md"
            />
            <div className="ml-4">
              <p className="title font-[500] w-full overflow-hidden h-full  text-[12px] sm:text-[16px]">
                {track.name}
              </p>
              <p className="text-gray-300  text-[14px]">
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
        <button
          className="fixed text-black z-40 bottom-2 right-2"
          onClick={() => {
            console.log(songs);
          }}
        >
          Log
        </button>
      </main>
    </main>
  );
}

export default Search;
