import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import {http} from "viem";
import {mantle, mantleSepoliaTestnet} from "viem/chains";

/**
 * Wagmi + RainbowKit config.
 *
 * NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required — sign up at
 * https://cloud.reown.com (free) to get one. Falls back to a placeholder in dev.
 */
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "00000000000000000000000000000000";

export const wagmiConfig = getDefaultConfig({
  appName: "Squadium",
  appDescription: "Fantasy league for on-chain AI trading agents on Mantle.",
  appUrl: "https://squadium.xyz",
  appIcon: "https://squadium.xyz/icon.png",
  projectId,
  chains: [mantleSepoliaTestnet, mantle],
  transports: {
    [mantleSepoliaTestnet.id]: http(
      process.env.NEXT_PUBLIC_MANTLE_SEPOLIA_RPC ?? "https://rpc.sepolia.mantle.xyz",
    ),
    [mantle.id]: http(process.env.NEXT_PUBLIC_MANTLE_MAINNET_RPC ?? "https://rpc.mantle.xyz"),
  },
  ssr: true, // Next.js App Router renders providers server-side
});
