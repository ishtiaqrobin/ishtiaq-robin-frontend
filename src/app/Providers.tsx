"use client";

import dynamic from 'next/dynamic';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

const SmoothScrollProvider = dynamic(() => import('@/providers/SmoothScrollProvider'), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster
      // position="top-right"
      // richColors
      />
      <SmoothScrollProvider>
        {children}
      </SmoothScrollProvider>
    </NextThemesProvider>
  );
}
