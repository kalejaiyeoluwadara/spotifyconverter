import React, { useState } from "react";
import axios from "axios";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";

const CLIENT_ID =
  "587491759521-jgt4asu6g2k32geeovcalb4td5p4a4ql.apps.googleusercontent.com";
const API_KEY = "YOUR_API_KEY"; // Replace with your YouTube Data API key

const YoutubePlaylistCreator = () => {
  const [playlistLink, setPlaylistLink] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = async (response) => {
    const accessToken = response.access_token;

    try {
      const playlistResponse = await createPlaylist("My Playlist", accessToken);
      const playlistId = playlistResponse.id;

      const songTitles = ["song1", "song2", "song3"]; // Replace with your song titles
      const videoIds = await searchYouTubeVideos(songTitles, accessToken);

      await addVideosToPlaylist(playlistId, videoIds, accessToken);

      setPlaylistLink(`https://www.youtube.com/playlist?list=${playlistId}`);
    } catch (error) {
      setErrorMessage("Failed to create playlist");
    }
  };

  const handleLoginFailure = (response) => {
    setErrorMessage("Failed to authenticate");
  };

  const searchYouTubeVideos = async (songTitles, accessToken) => {
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

  const createPlaylist = async (title, accessToken) => {
    try {
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
      return response.data;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw error;
    }
  };

  const addVideosToPlaylist = async (playlistId, videoIds, accessToken) => {
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

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="flex flex-col items-center justify-center h-screen">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
        />
        {isLoading && <p>Loading...</p>}
        {errorMessage && <p>{errorMessage}</p>}
        {playlistLink && (
          <div className="mt-4">
            <p>Playlist Link:</p>
            <a href={playlistLink} target="_blank" rel="noopener noreferrer">
              {playlistLink}
            </a>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default YoutubePlaylistCreator;
