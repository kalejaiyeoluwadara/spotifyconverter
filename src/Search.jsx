import React, { useState, useEffect } from "react";

const CLIENT_ID = "21fa13dee5a54da78be93d4db02485b7";
const CLIENT_SECRET = "804c5ddb54084b66817823648dd78cf7";

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((response) => response.json())
      .then((data) => {
        setAccessToken(data.access_token);
      })
      .catch((error) => console.error("Error fetching access token:", error));
  }, []);

  const search = () => {
    const searchParameters = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=album`,
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        setAlbums(data.albums.items);
        console.log(data.albums.items);
      })
      .catch((error) => console.error("Error searching for albums:", error));
  };

  return (
    <main className="flex h-screen flex-col w-screen justify-start">
      <div className="w-screen flex items-center py-8 sm:px-4 h-[100px] justify-center">
        <input
          placeholder="Search for artist"
          value={searchInput}
          className="p-3 sm:w-[400px] w-[200px] "
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
        />
        <button
          onClick={search}
          className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Search
        </button>
      </div>
      {/* cards */}
      <main className="cards flex w-screen px-[20%] items-center justify-start flex-wrap">
        {albums.map((album) => (
          <div
            key={album.id}
            className="card w-[250px] flex flex-col items-center justify-center h-auto py-4 bg-white shadow-md rounded-md m-4"
          >
            <img
              src={album.images[0]?.url}
              alt={album.name}
              className="w-full h-full object-cover rounded-md"
            />
            <p className="title px-2 font-[400] capitalize text-[15px] mt-2">
              {album.name}
            </p>
          </div>
        ))}
      </main>
    </main>
  );
}

export default Search;
