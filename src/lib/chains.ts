import {mantle, mantleSepoliaTestnet} from "viem/chains";
import type {Chain} from "viem";

/**
 * Squadium chain config.
 *
 * W1-W2: Mantle Sepolia (testnet) — chainId 5003
 * W3-W4: Mantle Mainnet           — chainId 5000
 *
 * `defaultChain` is what the wallet opens to on first connect.
 */
export const supportedChains = [mantleSepoliaTestnet, mantle] as const satisfies readonly Chain[];

export const defaultChain: Chain = mantleSepoliaTestnet;

export const chainById: Record<number, Chain> = {
  [mantle.id]: mantle,
  [mantleSepoliaTestnet.id]: mantleSepoliaTestnet,
};

export function explorerTxUrl(chainId: number, txHash: string): string {
  const chain = chainById[chainId];
  const base = chain?.blockExplorers?.default.url ?? "https://sepolia.mantlescan.xyz";
  return `${base}/tx/${txHash}`;
}

export function explorerAddressUrl(chainId: number, address: string): string {
  const chain = chainById[chainId];
  const base = chain?.blockExplorers?.default.url ?? "https://sepolia.mantlescan.xyz";
  return `${base}/address/${address}`;
}
