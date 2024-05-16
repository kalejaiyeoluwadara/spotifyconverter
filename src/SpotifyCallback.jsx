// import React, { useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import queryString from "query-string";

// function SpotifyCallback() {
//   const history = useHistory();

//   useEffect(() => {
//     const handleCallback = () => {
//       const params = queryString.parse(window.location.hash);
//       const { access_token } = params;

//       if (access_token) {
//         // Store the access token securely (e.g., in local storage)
//         localStorage.setItem("spotifyAccessToken", access_token);
//         // Redirect the user to another component/page
//         history.push("/home");
//       } else {
//         // Handle case where access token is not present in URL fragment
//         console.error("Access token not found in URL fragment");
//         // Redirect to an error page or the login page
//         history.push("/login");
//       }
//     };

//     // Call handleCallback when the component mounts
//     handleCallback();
//   }, [history]);

//   return <div>Redirecting...</div>;
// }

// export default SpotifyCallback;
