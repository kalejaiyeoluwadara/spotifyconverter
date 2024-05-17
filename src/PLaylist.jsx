import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const CLIENT_ID =
  "274611943732-5qbrec58ibrfh42l2r9rqv3j36qedr11.apps.googleusercontent.com"

const YoutubeAccessToken = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    setAccessToken(response.access_token);
  };

  const handleLoginFailure = (response) => {
    console.log("Login Failure:", response);
    setErrorMessage("Failed to authenticate");
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="flex flex-col items-center justify-center h-screen">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
        />
        {accessToken && (
          <div className="mt-4">
            <p>Access Token:</p>
            <code>{accessToken}</code>
          </div>
        )}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default YoutubeAccessToken;
