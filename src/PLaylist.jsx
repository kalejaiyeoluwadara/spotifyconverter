import React, { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useGlobal } from "./context"; // Import the useGlobal hook

const CLIENT_ID =
  "274611943732-5qbrec58ibrfh42l2r9rqv3j36qedr11.apps.googleusercontent.com";
const API_KEY = "AIzaSyDeGOENcYMtKNKaAVJMYVNFn8RSkQrkJf0";

const YoutubePlaylistCreator = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [playlistLink, setPlaylistLink] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { songs } = useGlobal(); // Access the songs state from useGlobal hook

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    const token = response.credential;
    const accessToken = token
      ? JSON.parse(atob(token.split(".")[1])).access_token
      : null;
    setAccessToken(accessToken);
  };

  const handleLoginFailure = (response) => {
    console.log("Login Failure:", response);
    setErrorMessage("Failed to authenticate");
  };

  const createPlaylist = async (title, songTitles) => {
    if (!accessToken) {
      setErrorMessage("No access token available");
      return;
    }

    try {
      setIsLoading(true);
      // Create the playlist
      const playlistResponse = await axios.post(
        "https://www.googleapis.com/youtube/v3/playlists",
        {
          snippet: {
            title: title,
          },
          status: {
            privacyStatus: "public",
          },
        },
        {
          params: {
            part: "snippet,status",
            key: API_KEY,
            access_token: accessToken,
          },
        }
      );

      const playlistId = playlistResponse.data.id;

      // Add videos to the playlist
      const videoIds = await searchYouTubeVideos(songTitles);
      await addVideosToPlaylist(playlistId, videoIds);

      setPlaylistLink(`https://www.youtube.com/playlist?list=${playlistId}`);
      setIsLoading(false);
      console.log(`Playlist created: ${playlistLink}`);
    } catch (error) {
      console.error("Error creating playlist:", error);
      setErrorMessage("Failed to create playlist");
      setIsLoading(false);
    }
  };

  const searchYouTubeVideos = async (songTitles) => {
    const videoIds = [];
    for (const title of songTitles) {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: title,
            type: "video",
            key: API_KEY,
            access_token: accessToken,
          },
        }
      );
      if (response.data.items.length > 0) {
        videoIds.push(response.data.items[0].id.videoId);
      }
    }
    return videoIds;
  };

  const addVideosToPlaylist = async (playlistId, videoIds) => {
    for (const videoId of videoIds) {
      await axios.post(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: videoId,
            },
          },
        },
        {
          params: {
            part: "snippet",
            key: API_KEY,
            access_token: accessToken,
          },
        }
      );
    }
  };

  const fetchVideos = async () => {
    const limitedSongs = songs.slice(0, 3); // Get the first 3 songs
    const songTitles = limitedSongs.map((song) => song.name);
    await createPlaylist("My Playlist", songTitles);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="flex flex-col items-center justify-center h-screen">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
        />
        {isLoading && <p>Loading...</p>}
        {accessToken && (
          <button
            onClick={fetchVideos}
            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Create Playlist
          </button>
        )}
        {playlistLink && (
          <div className="mt-4">
            <p>Playlist Link:</p>
            <a href={playlistLink} target="_blank" rel="noopener noreferrer">
              {playlistLink}
            </a>
          </div>
        )}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default YoutubePlaylistCreator;
