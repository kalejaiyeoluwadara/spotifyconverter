import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useGlobal } from "./context"; // Import the useGlobal hook to access stored
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../src/config/firebase";
import { IoCopyOutline } from "react-icons/io5";
import Limit from "./component/Modal";
// API details
const CLIENT_ID =
  "587491759521-1cg5rmreu9ds28sups1ddhnkhsu7or1c.apps.googleusercontent.com";
const API_KEY = "AIzaSyDEmTTY2neJdt5GT6Y378zryQAo_j7EDvQ";

// Three main functions going on on the backend
// 1. Fetch videos in the songs array from the spotify playlist (search for all the songs on youtube)
// 2. If song exists add the song to the playlist
// 3. Generate ID for playlist and render the playlist link to user

const YoutubePlaylistCreator = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [playlistLink, setPlaylistLink] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { songs, limit, setLimit, modal, setModal } = useGlobal(); // Access the songs state from useGlobal hook

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);
  // Function to handle login
  const handleLoginSuccess = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/youtube");

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
      console.log("Access Token:", token);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.error("The authentication popup was closed before completion.");
        setErrorMessage("Authentication was canceled. Please try again.");
      } else {
        console.error("Login Failure:", error);
        setErrorMessage("Failed to authenticate");
      }
    }
  };
  // Function for logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setAccessToken(null);
        localStorage.removeItem("accessToken");
        console.log("Logged out successfully");
      })
      .catch((error) => {
        console.error("Logout Failure:", error);
        setErrorMessage("Failed to log out");
      });
  };
  // Function to createPlaylist
  const createPlaylist = async (title, songTitles) => {
    if (!accessToken) {
      setErrorMessage("No access token available, Login");
      console.error("No access token available, Login");
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
  // Function to search the videos on youtube
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
  // Function to add videos to playlist
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
  // Function to fetch videos from youtube API
  const fetchVideos = async () => {
    const songTitles = songs.map((song) => song.name).slice(0, parseInt(limit)); //limit to limit state range
    await createPlaylist("My Playlist", songTitles);
  };

  //Function to copy generated playlist link to clipboard
  const copyToClipboard = () => {
    if (playlistLink) {
      navigator.clipboard.writeText(playlistLink);
      alert("Playlist link copied to clipboard!");
    }
  };

  // Main view for
  return (
    // Wrapped in GoogOAuthProvider for login and signIn functionality
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="flex flex-col bg-black text-white relative items-center justify-center h-screen">
        <button
          onClick={() => {
            setModal(!modal);
          }}
          className="absolute left-3 top-4 "
        >
          limit
        </button>
        <Limit />

        {/* If access token is available Logout button and Login button are rendered, else they are not, if user is already logged in Logout button is rendered  */}
        {accessToken ? (
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLoginSuccess}
            className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Login with Google
          </button>
        )}
        {/* While loading loading text is displayed */}
        {isLoading && <p>Loading...</p>}

        {/* Create Playlist button */}
        <button
          onClick={fetchVideos}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Create Playlist
        </button>
        {/* if playlist link has been generated it is displayed */}
        {playlistLink && (
          <div className="mt-4 w-full absolute bottom-[100px] flex  items-center justify-center">
            <p className="bg-white px-2 py-2 mr-1 text-black rounded-md">
              Playlist Link:
            </p>
            <a
              href={playlistLink}
              className="text-blue-500 sm:w-auto w-[100px] overflow-hidden "
              target="_blank"
              rel="noopener noreferrer"
            >
              {playlistLink}
            </a>
            <div className="cursor-pointer" onClick={copyToClipboard}>
              <IoCopyOutline className="text-white ml-4" size={20} />
            </div>
          </div>
        )}
        {/* If error, error messages is displayed */}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default YoutubePlaylistCreator;
