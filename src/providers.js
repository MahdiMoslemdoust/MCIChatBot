"use client";

import { CacheProvider, ThemeProvider } from "@emotion/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import React from "react";
import stylisRTLPlugin from "stylis-plugin-rtl";
import { createTheme } from "@mui/material/styles";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

const theme = () =>
  createTheme({
    direction: "rtl",
  });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const Providers = ({ children }) => {
  return (
    <AppRouterCacheProvider options={{ stylisPlugins: [stylisRTLPlugin] }}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </CacheProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
