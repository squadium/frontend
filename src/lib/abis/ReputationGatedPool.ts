export const ReputationGatedPoolAbi = [
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "_oracle",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "_maxStaleness",
                           "type":  "uint64",
                           "internalType":  "uint64"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "BASE_RATE_BPS",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint16",
                            "internalType":  "uint16"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "MAX_DISCOUNT_BPS",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint16",
                            "internalType":  "uint16"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "MIN_CONFIDENCE",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint16",
                            "internalType":  "uint16"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "MIN_TIER",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint8",
                            "internalType":  "uint8"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "borrowRateBps",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint16",
                            "internalType":  "uint16"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "eligible",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "maxStaleness",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint64",
                            "internalType":  "uint64"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "oracle",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract AgentReputationOracle"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "error",
        "name":  "ConfidenceTooLow",
        "inputs":  [
                       {
                           "name":  "confidence",
                           "type":  "uint16",
                           "internalType":  "uint16"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "NotRated",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ReputationStale",
        "inputs":  [
                       {
                           "name":  "asOf",
                           "type":  "uint64",
                           "internalType":  "uint64"
                       },
                       {
                           "name":  "nowTs",
                           "type":  "uint64",
                           "internalType":  "uint64"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "TierTooLow",
        "inputs":  [
                       {
                           "name":  "tier",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       }
                   ]
    }
] as const;

