import type { MetadataRoute } from "next";

/**
 * Lets students "Add to Home Screen" and get a proper app icon that opens
 * straight to the site — mainly useful for checking prayer times on the move.
 * The shortcuts appear on a long-press of the icon on Android.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aston ISOC — Islamic Society",
    short_name: "Aston ISOC",
    description: "Prayer times, events and community for Muslim students at Aston University, Birmingham.",
    start_url: "/",
    display: "standalone",
    background_color: "#130d28",
    theme_color: "#130d28",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcuts: [
      { name: "Prayer times", url: "/prayer-times" },
      { name: "Events", url: "/events" },
      { name: "Share feedback", url: "/feedback" },
    ],
  };
}
