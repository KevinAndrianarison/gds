import { createContext, useState } from 'react';

export const ShowContext = createContext({});

export function ShowContextProvider({ children }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isConnexion, setIsConnexion] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSpinnerView, setIsSpinnerView] = useState(false);

  return (
    <ShowContext.Provider
      value={{
        isLogin,
        isSpinnerView,
        isConnexion,
        isForgotPassword,
        setIsLogin,
        setIsForgotPassword,
        setIsConnexion,
        setIsSpinnerView
      }}
    >
      {children}
    </ShowContext.Provider>
  );
}
