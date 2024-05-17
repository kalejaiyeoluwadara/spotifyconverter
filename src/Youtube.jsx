import React, { useState, useEffect } from "react";
import youtube from "./api/youtube"; // assuming the axios instance file is named youtube.js
import { useGlobal } from "./context";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/config/firebase"; // Import the Firestore instance

function Youtube() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { songs } = useGlobal();

  const addToPlayList = async () => {
    try {
      const playlist = videos.map((video) => ({
        title: video.snippet.title,
        description: video.snippet.description,
        videoId: video.id.videoId,
        thumbnailUrl: video.snippet.thumbnails.default.url,
      }));

      // Add the playlist array as a single document to the "playlist" collection
      await addDoc(collection(db, "playlist"), { videos: playlist });

      console.log("Playlist added to Firestore successfully!");
    } catch (error) {
      console.error("Error adding playlist to Firestore:", error);
    }
  };


  const searchYouTube = async (query) => {
    try {
      setIsLoading(true);
      setErrorMessage(""); // Reset error message

      const response = await youtube.get("/search", {
        params: {
          part: "snippet",
          type: "video",
          q: query,
        },
      });

      setVideos((prevVideos) => [...prevVideos, ...response.data.items]);
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        setErrorMessage("Failed to fetch YouTube data: Server Error");
      } else if (error.request) {
        setErrorMessage("Failed to fetch YouTube data: No Response");
      } else {
        setErrorMessage("Failed to fetch YouTube data: Network Error");
      }
      console.error("Error fetching YouTube data:", error);
      setIsLoading(false);
    }
  };

  const fetchVideos = async () => {
    const limitedSongs = songs.slice(0, 10); // Get the first 10 songs
    for (const song of limitedSongs) {
      console.log("Searching for song:", song.name);
      await searchYouTube(song.name);
      if (errorMessage) {
        console.log("Error message encountered:", errorMessage);
      }
    }
    console.log(videos);
  };

  const handleVisitButtonClick = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <main className="flex flex-col-reverse w-screen overflow-hidden items-center justify-center">
      <div className="flex flex-col items-center justify-start w-full h-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <div className="mt-8 pb-20 ">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video.id.videoId} className="flex items-center mb-4">
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    className="w-48 h-auto mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {video.snippet.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {video.snippet.description}
                    </p>
                    <button
                      className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      onClick={() => handleVisitButtonClick(video.id.videoId)}
                    >
                      Visit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No videos found yet.</p>
            )}
          </div>
        )}
      </div>
      {videos.length > 0 && (
        <div className="w-full flex items-center justify-center">
          <button
            className="ml-4 mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={addToPlayList}
          >
            Add songs to playlist
          </button>
        </div>
      )}
      <div className="w-full flex items-center justify-center">
        <button
          className="ml-4 mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          onClick={fetchVideos}
        >
          Fetch songs from youtube
        </button>
      </div>
    </main>
  );
}

export default Youtube;
