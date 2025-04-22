import React, { useContext } from 'react';
import Login from './views/Login';
import SpinnerView from './views/SpinnerView';
import { ShowContext } from './contexte/useShow';

export default function App() {
  const { isLogin, isSpinnerView } = useContext(ShowContext);

  return (
    <div>
      {isLogin && <Login />}
      {isSpinnerView && <SpinnerView />}
    </div>
  );
}
