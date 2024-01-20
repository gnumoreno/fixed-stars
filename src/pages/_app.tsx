import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Script from "next/script";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <>
  <Head>
    {/* <meta name="google-signin-client_id" content="383086323854-erovqgtgonfasiljehjcect0gun8m8rl.apps.googleusercontent.com"/> */}
  </Head>
  <Script src="https://accounts.google.com/gsi/client" async defer/>
  <Script id="google-credentials-response">
    {`
      function handleCredentialResponse(response) {
        const responsePayload = decodeJwtResponse(response.credential);

        console.log("ID: " + responsePayload.sub);
        console.log('Full Name: ' + responsePayload.name);
        console.log('Given Name: ' + responsePayload.given_name);
        console.log('Family Name: ' + responsePayload.family_name);
        console.log("Image URL: " + responsePayload.picture);
        console.log("Email: " + responsePayload.email);
      }
    `}
  </Script>
  <Component {...pageProps} />;
  </>
};

export default api.withTRPC(MyApp);
