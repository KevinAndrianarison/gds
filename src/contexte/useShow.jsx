import { createContext, useState } from 'react';

export const ShowContext = createContext({});

export function ShowContextProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [isConnexion, setIsConnexion] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSpinnerView, setIsSpinnerView] = useState(false);
  const [isDash, setIsDash] = useState(true);

  return (
    <ShowContext.Provider
      value={{
        isLogin,
        isSpinnerView,
        isConnexion,
        isForgotPassword,
        isDash,
        setIsLogin,
        setIsForgotPassword,
        setIsConnexion,
        setIsSpinnerView,
        setIsDash
      }}
    >
      {children}
    </ShowContext.Provider>
  );
}
