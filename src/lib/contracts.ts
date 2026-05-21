import {mantle, mantleSepoliaTestnet} from "viem/chains";
import type {Address} from "viem";

import {
  AgentRegistryAbi,
  AgentReputationOracleAbi,
  LiquidReputationAbi,
  ReputationGatedPoolAbi,
  RewardDistributorAbi,
  SquadiumAbi,
} from "./abis";

export type ContractName =
  | "AgentRegistry"
  | "AgentReputationOracle"
  | "Squadium"
  | "LiquidReputation"
  | "RewardDistributor"
  | "ReputationGatedPool";

const ZERO: Address = "0x0000000000000000000000000000000000000000";

/**
 * Live Mantle Sepolia deployment (2026-05-19) — see contracts/deployments.md.
 * Hardcoded as fallback so the dapp Just Works without env vars; production
 * env (NEXT_PUBLIC_*_SEPOLIA_ADDRESS) overrides per-deploy.
 */
const SEPOLIA_DEFAULTS: Record<ContractName, Address> = {
  AgentRegistry: "0x5C8061694C8c1b4A2aB39762754D9a0DC549fBB1",
  AgentReputationOracle: "0x6a9aff1F4352648b39De2771A1Ed3f0F85E9D764",
  Squadium: "0x4299b716F33Be7F43D0Ebf0c1F4863D3fC4b37ec",
  LiquidReputation: "0xE633d2bBb9D610A3dA777a651C1497257a159557",
  RewardDistributor: "0x2E4567125B73eEdA6b6B276a7ea7a9a4bd44aC22",
  ReputationGatedPool: "0x30A9F0d212227d47fBb1D6dF1431E7802376Ea33",
};

function envOr(name: string, fallback: Address): Address {
  const v = process.env[name];
  if (!v || !v.startsWith("0x") || v.length !== 42) return fallback;
  return v as Address;
}

export const addresses: Record<number, Record<ContractName, Address>> = {
  [mantleSepoliaTestnet.id]: {
    AgentRegistry: envOr("NEXT_PUBLIC_AGENT_REGISTRY_SEPOLIA_ADDRESS", SEPOLIA_DEFAULTS.AgentRegistry),
    AgentReputationOracle: envOr(
      "NEXT_PUBLIC_AGENT_REPUTATION_ORACLE_SEPOLIA_ADDRESS",
      SEPOLIA_DEFAULTS.AgentReputationOracle,
    ),
    Squadium: envOr("NEXT_PUBLIC_SQUADIUM_SEPOLIA_ADDRESS", SEPOLIA_DEFAULTS.Squadium),
    LiquidReputation: envOr("NEXT_PUBLIC_LIQUID_REPUTATION_SEPOLIA_ADDRESS", SEPOLIA_DEFAULTS.LiquidReputation),
    RewardDistributor: envOr("NEXT_PUBLIC_REWARD_DISTRIBUTOR_SEPOLIA_ADDRESS", SEPOLIA_DEFAULTS.RewardDistributor),
    ReputationGatedPool: envOr(
      "NEXT_PUBLIC_REPUTATION_GATED_POOL_SEPOLIA_ADDRESS",
      SEPOLIA_DEFAULTS.ReputationGatedPool,
    ),
  },
  [mantle.id]: {
    AgentRegistry: envOr("NEXT_PUBLIC_AGENT_REGISTRY_MAINNET_ADDRESS", ZERO),
    AgentReputationOracle: envOr("NEXT_PUBLIC_AGENT_REPUTATION_ORACLE_MAINNET_ADDRESS", ZERO),
    Squadium: envOr("NEXT_PUBLIC_SQUADIUM_MAINNET_ADDRESS", ZERO),
    LiquidReputation: envOr("NEXT_PUBLIC_LIQUID_REPUTATION_MAINNET_ADDRESS", ZERO),
    RewardDistributor: envOr("NEXT_PUBLIC_REWARD_DISTRIBUTOR_MAINNET_ADDRESS", ZERO),
    ReputationGatedPool: envOr("NEXT_PUBLIC_REPUTATION_GATED_POOL_MAINNET_ADDRESS", ZERO),
  },
};

export const abis = {
  AgentRegistry: AgentRegistryAbi,
  AgentReputationOracle: AgentReputationOracleAbi,
  Squadium: SquadiumAbi,
  LiquidReputation: LiquidReputationAbi,
  RewardDistributor: RewardDistributorAbi,
  ReputationGatedPool: ReputationGatedPoolAbi,
} as const;

/**
 * Resolve `{address, abi}` for a contract on a specific chain.
 *
 * Returns `null` if the address has not been set (so callers can render a
 * "deploy first" empty state instead of failing).
 */
export function getContract<N extends ContractName>(chainId: number, name: N) {
  const address = addresses[chainId]?.[name];
  if (!address || address === ZERO) return null;
  return {address, abi: abis[name]};
}
