import "@/styles/globals.css";
import "@/styles/landing.css";
import type { AppProps } from "next/app";
import { AppProvider } from "../lib/context";
import AppLayout from "../components/AppLayout";

export default function App({ Component, pageProps }: AppProps) {
  // Check if page wants to opt out of layout (for special cases like index which has its own sidebar)
  const useLayout = !(Component as any).noLayout;
  
  return (
    <AppProvider>
      {useLayout ? (
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </AppProvider>
  );
}
