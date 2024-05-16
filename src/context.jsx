import React, { useContext, useState, useEffect } from "react";
const AppContext = React.createContext();

function AppProvider({ children }) {
  const [menu, setMenu] = useState(false);
  const [songs,setSongs] = useState([]);
  return (
    <AppContext.Provider
      value={{
       songs,setSongs
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
