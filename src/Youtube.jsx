import React, { useState, useEffect } from "react";
import youtube from "./api/youtube"; // assuming the axios instance file is named youtube.js
import { useGlobal } from "./context";

function Youtube() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { songs } = useGlobal();

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
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setErrorMessage("Failed to fetch YouTube data: Server Error");
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("Failed to fetch YouTube data: No Response");
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage("Failed to fetch YouTube data: Network Error");
      }
      console.error("Error fetching YouTube data:", error);
      setIsLoading(false);
    }
  };

    const fetchVideos = async () => {
      const limitedSongs = songs.slice(0, 3); // Get the first 10 songs
      for (const song of limitedSongs) {
        console.log("Searching for song:", song.name);
        await searchYouTube(song.name);
        if (errorMessage) {
          console.log("Error message encountered:", errorMessage);
        }
      }
    };
    

  return (
    <main className="flex flex-col-reverse items-center justify-center">
      <div className="flex flex-col items-center justify-start w-screen h-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <div className="mt-8">
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
                  </div>
                </div>
              ))
            ) : (
              <p>No videos found.</p>
            )}
          </div>
        )}
      </div>

      <div className="w-screen flex items-center justify-center " >
        <button
          className="ml-4 mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          onClick={fetchVideos}
        >
          Fetch
        </button>
      </div>
    </main>
  );
}

export default Youtube;
