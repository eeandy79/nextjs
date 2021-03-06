import Router from 'next/router';
import { Auth0Provider } from '@auth0/auth0-react';

import "../styles/globals.css"
import "../assets/styles/tailwind.css"
import "@fortawesome/fontawesome-free/css/all.min.css";
import console from 'console'

const onRedirectCallback = (appState) => {
  console.log(appState);
  Router.push(appState?.returnTo || '/');
};

function MyApp({ Component, pageProps }) {
  return (
	  <Auth0Provider
        domain={process.env.NEXT_PUBLIC_DOMAIN}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
        audience={process.env.NEXT_PUBLIC_AUDIENCE}
        scope="read:current_user update:current_user_metadata"
        redirectUri={process.env.NEXT_PUBLIC_CALLBACK}
        onRedirectCallback={onRedirectCallback}
      >
		<Component {...pageProps} />
	  </Auth0Provider>
  );
}

export default MyApp
