import React, { useContext } from 'react';
import Login from './views/Login';
import SpinnerView from './views/SpinnerView';
import { ShowContext } from './contexte/useShow';
import Dashboard from './views/Dashboard';
import Notiflix from 'notiflix';
import 'nprogress/nprogress.css';


Notiflix.Confirm.init({
  titleColor: '#3b82f6',
  okButtonBackground: '#3b82f6',

});


export default function App() {
  const { isLogin, isSpinnerView, isDash } = useContext(ShowContext);

  return (
    <div>
      {isLogin && <Login />}
      {isSpinnerView && <SpinnerView />}
      {isDash && <Dashboard />}
    </div>
  );
}
