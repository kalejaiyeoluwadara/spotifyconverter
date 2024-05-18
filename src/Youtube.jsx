import React, { useState } from "react";
import youtube from "./api/youtube"; // assuming the axios instance file is named youtube.js
import { useGlobal } from "./context";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/config/firebase"; // Import the Firestore instance

function Youtube() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);
  const { songs } = useGlobal();

  const addToPlayList = async () => {
    setIsAddingToPlaylist(true);
    try {
      const playlist = videos.map((video) => ({
        title: video.snippet.title,
        description: video.snippet.description,
        videoId: video.id.videoId,
        thumbnailUrl: video.snippet.thumbnails.default.url,
      }));

      // Add the playlist array as a single document to the "playlist" collection
      await addDoc(collection(db, "playlist"), { videos: playlist });

      setPlaylistCreated(true);
      console.log("Playlist added to Firestore successfully!");
    } catch (error) {
      console.error("Error adding playlist to Firestore:", error);
    } finally {
      setIsAddingToPlaylist(false);
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
   for (const song of songs) {
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
    <main className="flex flex-col w-screen min-h-screen bg-black text-white relative overflow-hidden items-center justify-center">
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
                    <h2 className="text-lg text-white font-semibold">
                      {video.snippet.title}
                    </h2>
                    <p className="text-sm text-white ">
                      {video.snippet.description}
                    </p>
                    <button
                      className="mt-2 px-4 py-2 hover:text-blue-500 transition-all text-white font-semibold"
                      onClick={() => handleVisitButtonClick(video.id.videoId)}
                    >
                      {'Visit >'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white" >No videos found yet.</p>
            )}
          </div>
        )}
      </div>
      {videos.length > 0 && (
        <div className="w-full fixed right-0 bottom-20 z-50 flex items-center sm:pr-20 justify-end">
          <button
            className={`ml-4 mt-4 px-4 py-2 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
              isAddingToPlaylist
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400"
            }`}
            onClick={addToPlayList}
            disabled={isAddingToPlaylist}
          >
            Add songs to playlist
          </button>
        </div>
      )}
      {playlistCreated && (
        <div className="w-full flex items-center text-white justify-center mt-4">
          <p className="text-green-500 font-semibold">
            Playlist created successfully!
          </p>
        </div>
      )}
     { videos.length < 1 && <div className="w-full h-full fixed bottom-20 z-50 flex items-center justify-center">
        <button
          className="ml-4 mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          onClick={fetchVideos}
        >
          Fetch songs from YouTube
        </button>
      </div>}
    </main>
  );
}

export default Youtube;
