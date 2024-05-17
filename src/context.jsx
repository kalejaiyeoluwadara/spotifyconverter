import React, { useContext, useState, useEffect } from "react";
const AppContext = React.createContext();

function AppProvider({ children }) {
  const [menu, setMenu] = useState(false);
  const [songs,setSongs] = useState([]);
  const [spotify,setSpotify] = useState(true)
  const [page,setPage] = useState('spotify');
  
  return (
    <AppContext.Provider
      value={{
        page,
        songs,setPage,
        setSongs,
        spotify,
        setSpotify,
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
