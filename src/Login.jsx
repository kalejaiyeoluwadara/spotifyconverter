import React from "react";
import SpotifyWebApi from "spotify-web-api-js";
import queryString from "query-string";

const spotifyApi = new SpotifyWebApi();

function SpotifyLogin() {
  const handleLogin = () => {
    const clientId = "21fa13dee5a54da78be93d4db02485b7";
    const redirectUri = "http://localhost:5173/";
    const scope = "user-read-private user-read-email"; // Add additional scopes as needed
    const queryParams = {
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: scope,
    };
    const authEndpoint = "https://accounts.spotify.com/authorize";
    window.location = `${authEndpoint}?${queryString.stringify(queryParams)}`;
  };

  return (
    <div>
      <button onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
}

export default SpotifyLogin;
