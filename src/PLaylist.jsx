import React, { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useGlobal } from "./context"; // Import the useGlobal hook
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db, auth } from "../src/config/firebase";

const CLIENT_ID =
  "587491759521-1cg5rmreu9ds28sups1ddhnkhsu7or1c.apps.googleusercontent.com";
const API_KEY = "AIzaSyDEmTTY2neJdt5GT6Y378zryQAo_j7EDvQ";

const YoutubePlaylistCreator = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [playlistLink, setPlaylistLink] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { songs } = useGlobal(); // Access the songs state from useGlobal hook

  const handleLoginSuccess = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/youtube");

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      setAccessToken(token);
      console.log("Access Token:", token);
    } catch (error) {
      console.error("Login Failure:", error);
      setErrorMessage("Failed to authenticate");
    }
  };

  const createPlaylist = async (title, songTitles) => {
    if (!accessToken) {
      setErrorMessage("No access token available");
      console.error("No access token available");
      return;
    }

    try {
      setIsLoading(true);
      const playlistData = {
        snippet: {
          title: title,
          description: "A playlist created with the YouTube API",
        },
        status: {
          privacyStatus: "public",
        },
      };

      console.log("Creating Playlist with Data:", playlistData);

      const playlistResponse = await axios.post(
        "https://www.googleapis.com/youtube/v3/playlists",
        playlistData,
        {
          params: {
            part: "snippet,status",
            key: API_KEY,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const playlistId = playlistResponse.data.id;
      console.log("Playlist ID:", playlistId);

      const videoIds = await searchYouTubeVideos(songTitles);
      await addVideosToPlaylist(playlistId, videoIds);

      setPlaylistLink(`https://www.youtube.com/playlist?list=${playlistId}`);
      setIsLoading(false);
      console.log(`Playlist created: ${playlistLink}`);
    } catch (error) {
      console.error("Error creating playlist:", error.response?.data || error);
      setErrorMessage("Failed to create playlist");
      setIsLoading(false);
    }
  };

  const searchYouTubeVideos = async (songTitles) => {
    const videoIds = [];
    for (const title of songTitles) {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              q: title,
              type: "video",
              key: API_KEY,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data.items.length > 0) {
          videoIds.push(response.data.items[0].id.videoId);
        }
      } catch (error) {
        console.error("Error searching video:", error.response?.data || error);
      }
    }
    return videoIds;
  };

  const addVideosToPlaylist = async (playlistId, videoIds) => {
    for (const videoId of videoIds) {
      try {
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
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error(
          "Error adding video to playlist:",
          error.response?.data || error
        );
      }
    }
  };

  const fetchVideos = async () => {
    const limitedSongs = songs.slice(0, 3); // Get the first 3 songs
    const songTitles = limitedSongs.map((song) => song.name);
    await createPlaylist("My Playlist", songTitles);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="flex flex-col bg-black text-white items-center justify-center h-screen">
        <button onClick={handleLoginSuccess}>Login with Google</button>
        {isLoading && <p>Loading...</p>}
        <button
          onClick={fetchVideos}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Create Playlist
        </button>
        {playlistLink && (
          <div className="mt-4">
            <p>Playlist Link:</p>
            <a href={playlistLink} target="_blank" rel="noopener noreferrer">
              {playlistLink}
            </a>
          </div>
        )}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default YoutubePlaylistCreator;
