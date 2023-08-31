import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { SessionProvider } from "next-auth/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  console.log("pageprops ",pageProps.session)
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  
  );
};

export default api.withTRPC(MyApp);
