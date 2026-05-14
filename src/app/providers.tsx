"use client";

import {RainbowKitProvider, darkTheme} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState, type ReactNode} from "react";
import {WagmiProvider} from "wagmi";

import {wagmiConfig} from "@/lib/wagmi";

export function Providers({children}: {children: ReactNode}) {
  // QueryClient inside state so it's stable across hot reloads
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#00d4ff",
            accentColorForeground: "#000000",
            borderRadius: "medium",
          })}
          appInfo={{appName: "Squadium"}}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
