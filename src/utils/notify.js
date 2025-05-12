import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { capitalize } from './capitalize';

// Configuration globale de Notiflix
Notify.init({
  position: 'right-top',
  distance: '15px',
  opacity: 1,
  borderRadius: '8px',
  timeout: 3000,
  messageMaxLength: 110,
  backOverlay: false,
  backOverlayColor: 'rgba(0,0,0,0.5)',
  plainText: true,
  showOnlyTheLastOne: true,
  clickToClose: true,
  pauseOnHover: true,
  zindex: 4001,
  fontFamily: 'Quicksand',
  fontSize: '14px',
  cssAnimation: true,
  cssAnimationDuration: 300,
  cssAnimationStyle: 'fade',
  success: {
    background: '#32c682',
    textColor: '#fff',
  },
  failure: {
    background: '#ff5549',
    textColor: '#fff',
  },
  warning: {
    background: '#eebf31',
    textColor: '#fff',
  },
  info: {
    background: '#26c0d3',
    textColor: '#fff',
  },
});

export const notify = {
  success: (message) => {
    Notify.success(capitalize(message));
  },
  error: (error) => {
    if (error.response) {
      if (error.response.data?.message) {
        Notify.failure(capitalize(error.response.data.message));
      } else {
        Notify.failure(capitalize('Erreur ' + error.response.status + ': ' + error.response.statusText));
      }
    } else if (error.request) {
      Notify.failure(capitalize('Impossible de se connecter au serveur'));
    } else if (typeof error === 'string') {
      Notify.failure(capitalize(error));
    } else {
      Notify.failure(capitalize(error.message || 'Une erreur inattendue est survenue'));
    }
  },
  warning: (message) => {
    Notify.warning(capitalize(message));
  },
  info: (message) => {
    Notify.info(capitalize(message));
  },
};
