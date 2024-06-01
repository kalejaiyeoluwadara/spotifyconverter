import React, { useContext, useState, useEffect } from "react";
const AppContext = React.createContext();

function AppProvider({ children }) {
  const [modal, setModal] = useState(false);
  const [songs, setSongs] = useState([]);
  const [spotify, setSpotify] = useState(true);
  const [page, setPage] = useState("spotify");
  const [limit, setLimit] = useState(5);
  return (
    <AppContext.Provider
      value={{
        modal,
        setModal,
        page,
        songs,
        setPage,
        setSongs,
        spotify,
        setSpotify,
        limit,
        setLimit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export const useGlobal = () => {
  return useContext(AppContext);
};

export default AppProvider;
