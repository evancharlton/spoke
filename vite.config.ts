import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      base: "/",
      manifest: {
        name: "Spøke",
        short_name: "Spøke",
        theme_color: "#000",
        icons: [
          {
            src: "logo-64.png",
            sizes: "64x64 32x32",
            type: "image/png",
          },
          {
            src: "logo-192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo-512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: ".",
      },

      devOptions: { enabled: true, navigateFallback: "index.html" },
      workbox: {
        cacheId: "spoke",
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              "pathname" in url &&
              typeof url.pathname === "string" &&
              url.pathname.endsWith(".json"),
            handler: "NetworkFirst",
          },
          {
            urlPattern: ({ url }) =>
              "pathname" in url &&
              typeof url.pathname === "string" &&
              url.pathname.endsWith(".png"),
            handler: "StaleWhileRevalidate",
          },
          {
            urlPattern: ({ url }) =>
              "pathname" in url &&
              typeof url.pathname === "string" &&
              url.pathname.endsWith(".svg"),
            handler: "StaleWhileRevalidate",
          },
        ],
      },
    }),
  ],
  base: "/",
});
