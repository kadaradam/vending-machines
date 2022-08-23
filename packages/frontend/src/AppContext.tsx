import React, { createContext, useContext, useState } from "react";

type AppContextType = {
  userLoggedIn: boolean;
  setUserLoggedIn: React.Dispatch<boolean>;
};

const AppContext = createContext<AppContextType>({
  userLoggedIn: false,
  setUserLoggedIn: () => false,
});

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  return appContext;
};

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <AppContext.Provider
      value={{
        userLoggedIn,
        setUserLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
