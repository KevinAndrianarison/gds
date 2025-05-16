import { isCancel } from 'axios';
import { createContext, useEffect, useState } from 'react';

export const ShowContext = createContext({});

export function ShowContextProvider({ children }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isConnexion, setIsConnexion] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSpinnerView, setIsSpinnerView] = useState(false);
  const [isDash, setIsDash] = useState(false);
  const [isACL, setIsACL] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=>{
    const role = localStorage.getItem('userRole');
    if (role === 'admin') {
      setIsAdmin(true);
    } else if (role === 'acl') {
      setIsACL(true);
    }
  },[])

  return (
    <ShowContext.Provider
      value={{
        isLogin,
        isSpinnerView,
        isConnexion,
        isForgotPassword,
        isDash,
        isACL,
        isAdmin,
        setIsLogin,
        setIsForgotPassword,
        setIsConnexion,
        setIsSpinnerView,
        setIsDash,
        setIsACL,
        setIsAdmin
      }}
    >
      {children}
    </ShowContext.Provider>
  );
}
