import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  getRedirectResult,
} from "firebase/auth";
import { db, auth } from "../src/config/firebase";

const FirebaseGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Error getting redirect result:", error);
        setErrorMessage("Failed to authenticate");
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Login Failure:", error);
      setErrorMessage("Failed to authenticate");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Failure:", error);
      setErrorMessage("Failed to logout");
    }
  };

  return (
    <div className="flex flex-col bg-black text-white items-center justify-center h-screen">
      {!user ? (
        <button
          onClick={handleLogin}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Login with Google
        </button>
      ) : (
        <>
          <div className="mt-4">
            <p>Welcome, {user.displayName}!</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              Logout
            </button>
          </div>
        </>
      )}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default FirebaseGoogleAuth;
