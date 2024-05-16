import React, { useState } from "react";
import youtube from "./api/youtube"; // assuming the axios instance file is named youtube.js

function Youtube() {
  const [searchInput, setSearchInput] = useState("");
  const [videos, setVideos] = useState([]);

  const searchYouTube = () => {
    youtube
      .get("/search", {
        params: {
          part: "snippet",
          type: "video",
          q: searchInput,
        },
      })
      .then((response) => {
        setVideos(response.data.items);
      })
      .catch((error) => {
        console.error("Error fetching YouTube data:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen">
      <div className="input w-screen bg-red-300 h-[100px] flex items-center justify-center py-8 ">
        <input
          placeholder="Search YouTube videos"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={searchYouTube}
          className="ml-4 mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        >
          Search
        </button>
      </div>

      <div className="mt-8">
        {videos.map((video) => (
          <div key={video.id.videoId} className="flex items-center mb-4">
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
              className="w-48 h-auto mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">{video.snippet.title}</h2>
              <p className="text-sm text-gray-600">
                {video.snippet.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Youtube;
