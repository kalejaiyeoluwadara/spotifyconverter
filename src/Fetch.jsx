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
    <main className="flex text-white bg-black sm:px-0 px-8 relative w-screen min-h-screen items-start justify-start">
      <div className="h-screen sm:visible invisible sm:block hidden bg-[#121212] mr-4 w-auto shadow-sm px-8 py-8 ">
        <div className="text-lg font-bold mb-6 ">
          <p>Playlists</p>
        </div>
        <div className="flex flex-col gap-1 text-[14px] font-semibold">
          <p className="py-2 px-4  w-auto overflow-hidden  text-ellipsis rounded-md shadow-sm ">
            All
          </p>
          {playlists.map((play) => {
            return (
              <p
                key={play.id}
                className="py-2 px-4  w-auto overflow-hidden  text-ellipsis rounded-md shadow-sm "
              >
                {play.title}
              </p>
            );
          })}
        </div>
      </div>
      <div className="w-full min-h-screen flex items-center justify-center">
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <div className="mt-8 pb-20">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <div key={playlist.id} className="mb-8 w-full">
                  <h2 className="text-[22px] font-bold mb-4">
                    {playlist.title}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {playlist.videos.map((video, index) => (
                      <div
                        key={index}
                        className="flex bg-[#121212] overflow-hidden rounded-[20px] flex-col items-center mb-4 pb-4 "
                      >
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-auto mb-2"
                        />
                        <div className="text-start px-2 ">
                          <h2 className="text-[18px] font-semibold">
                            {video.title}
                          </h2>
                          <button
                            className="mt-2 text-white font-semibold rounded-md   "
                            onClick={() =>
                              window.open(
                                `https://www.youtube.com/watch?v=${video.videoId}`,
                                "_blank"
                              )
                            }
                          >
                            {"Visit >"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full bg-red-200 w-full flex items-center justify-center">
                <p>No playlists found in the Firestore.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Playlist;
