import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Edgar Bonilla G. | (ed)studio",
    short_name: "(ed)studio",
    description:
      "UI/UX for accessible health, wellness, fitness, sports, and lifestyle products.",
    start_url: "/",
    display: "standalone",
    // Match --pwa-bg-color / --pwa-theme-color tokens (design-sync §2).
    background_color: "#050505",
    theme_color: "#FF4F18",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
