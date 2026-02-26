import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('SW registered:', registration))
        .catch((error) => console.log('SW registration failed:', error));
    }
  }, []);

  return (
    <ThemeProvider>
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  );
}