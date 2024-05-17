import React, { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const CLIENT_ID =
  "274611943732-5qbrec58ibrfh42l2r9rqv3j36qedr11.apps.googleusercontent.com";
const API_KEY = "AIzaSyDEmTTY2neJdt5GT6Y378zryQAo_j7EDvQ";

const YoutubePlaylistCreator = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [playlistLink, setPlaylistLink] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    setAccessToken(response.access_token);
  };

  const handleLoginFailure = (response) => {
    console.log("Login Failure:", response);
    setErrorMessage("Failed to authenticate");
  };

  const createPlaylist = async (title) => {
    if (!accessToken) {
      setErrorMessage("No access token available");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
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

      const playlistId = response.data.id;
      setPlaylistLink(`https://www.youtube.com/playlist?list=${playlistId}`);
      setIsLoading(false);
      console.log(
        `Playlist created: https://www.youtube.com/playlist?list=${playlistId}`
      );
    } catch (error) {
      console.error("Error creating playlist:", error);
      setErrorMessage("Failed to create playlist");
      setIsLoading(false);
    }
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
            onClick={() => createPlaylist("My Playlist")}
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
