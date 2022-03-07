import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { UserContext } from "@lib/context";
import createEmotionCache from "@lib/createEmotionCache";
import { useUserData } from "@lib/hooks";
import theme from "@lib/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import * as React from "react";
import { Toaster } from "react-hot-toast";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const userData = useUserData();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <UserContext.Provider value={userData}>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
          <Toaster />
        </UserContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}
