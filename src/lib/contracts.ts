import {mantle, mantleSepoliaTestnet} from "viem/chains";
import type {Address} from "viem";

import {
  AgentRegistryAbi,
  LiquidReputationAbi,
  RewardDistributorAbi,
  SortinoOracleAbi,
  SquadiumAbi,
} from "./abis";

export type ContractName =
  | "AgentRegistry"
  | "Squadium"
  | "LiquidReputation"
  | "RewardDistributor"
  | "SortinoOracle";

const ZERO: Address = "0x0000000000000000000000000000000000000000";

/**
 * Contract addresses per chain. Filled via env after `forge script Deploy.s.sol`.
 *
 * Each address: NEXT_PUBLIC_<CONTRACT>_<CHAIN>_ADDRESS
 *   e.g. NEXT_PUBLIC_AGENT_REGISTRY_SEPOLIA_ADDRESS
 */
function envAddr(name: string): Address {
  const v = process.env[name];
  if (!v || !v.startsWith("0x") || v.length !== 42) return ZERO;
  return v as Address;
}

export const addresses: Record<number, Record<ContractName, Address>> = {
  [mantleSepoliaTestnet.id]: {
    AgentRegistry: envAddr("NEXT_PUBLIC_AGENT_REGISTRY_SEPOLIA_ADDRESS"),
    Squadium: envAddr("NEXT_PUBLIC_SQUADIUM_SEPOLIA_ADDRESS"),
    LiquidReputation: envAddr("NEXT_PUBLIC_LIQUID_REPUTATION_SEPOLIA_ADDRESS"),
    RewardDistributor: envAddr("NEXT_PUBLIC_REWARD_DISTRIBUTOR_SEPOLIA_ADDRESS"),
    SortinoOracle: envAddr("NEXT_PUBLIC_SORTINO_ORACLE_SEPOLIA_ADDRESS"),
  },
  [mantle.id]: {
    AgentRegistry: envAddr("NEXT_PUBLIC_AGENT_REGISTRY_MAINNET_ADDRESS"),
    Squadium: envAddr("NEXT_PUBLIC_SQUADIUM_MAINNET_ADDRESS"),
    LiquidReputation: envAddr("NEXT_PUBLIC_LIQUID_REPUTATION_MAINNET_ADDRESS"),
    RewardDistributor: envAddr("NEXT_PUBLIC_REWARD_DISTRIBUTOR_MAINNET_ADDRESS"),
    SortinoOracle: envAddr("NEXT_PUBLIC_SORTINO_ORACLE_MAINNET_ADDRESS"),
  },
};

export const abis = {
  AgentRegistry: AgentRegistryAbi,
  Squadium: SquadiumAbi,
  LiquidReputation: LiquidReputationAbi,
  RewardDistributor: RewardDistributorAbi,
  SortinoOracle: SortinoOracleAbi,
} as const;

/**
 * Resolve `{address, abi}` for a contract on a specific chain.
 *
 * Returns `null` if the address has not been set in env for the given chain
 * (so callers can render a "deploy first" empty state instead of failing).
 */
export function getContract<N extends ContractName>(chainId: number, name: N) {
  const address = addresses[chainId]?.[name];
  if (!address || address === ZERO) return null;
  return {address, abi: abis[name]};
}
