import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/config/firebase"; // Import the Firestore instance

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(""); // Reset error message

        const querySnapshot = await getDocs(collection(db, "playlist"));
        if (!querySnapshot.empty) {
          const playlistsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title || `Playlist ${doc.id}`, // Using document ID as title if not provided
            videos: doc.data().videos || [], // Access the videos array
          }));

          setPlaylists(playlistsData);
        } else {
          setErrorMessage("No playlists found in Firestore");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching playlists from Firestore:", error);
        setErrorMessage("Failed to fetch playlists from Firestore");
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <main className="flex flex-col w-screen sm:px-8 px-4 overflow-hidden items-center justify-center">
      <div className="w-full h-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <div className="mt-8 pb-20">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <div key={playlist.id} className="mb-8 w-full">
                  <h2 className="text-2xl font-bold mb-4">{playlist.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {playlist.videos.map((video, index) => (
                      <div key={index} className="flex flex-col items-center mb-4">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-auto mb-2"
                        />
                        <div className="text-center">
                          <h2 className="text-lg font-semibold">{video.title}</h2>
                          <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            onClick={() =>
                              window.open(
                                `https://www.youtube.com/watch?v=${video.videoId}`,
                                "_blank"
                              )
                            }
                          >
                            Visit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No playlists found in the Firestore.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Playlist;
