/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    Cuchulink: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "codigo",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "nombre",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "montoPorRonda",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "numParticipantes",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "creador",
              type: "address",
            },
          ],
          name: "CuchubalCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "codigo",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "participant",
              type: "address",
            },
          ],
          name: "ParticipantJoined",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "codigo",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "participant",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "PaymentMade",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "codigo",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "rondaActual",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "winner",
              type: "address",
            },
          ],
          name: "RoundCompleted",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "nombre",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "montoPorRonda",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "numParticipantes",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "createCuchubal",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "getCuchubalInfo",
          outputs: [
            {
              internalType: "string",
              name: "nombre",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "montoPorRonda",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "numParticipantes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "rondaActual",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "finished",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "creator",
              type: "address",
            },
          ],
          name: "getCuchubalesByCreator",
          outputs: [
            {
              internalType: "string[]",
              name: "",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "getParticipants",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
            {
              components: [
                {
                  internalType: "bool",
                  name: "hasPaid",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "totalPaid",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "hasJoined",
                  type: "bool",
                },
              ],
              internalType: "struct Cuchulink.Participant[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "getParticipantsPaid",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
            {
              components: [
                {
                  internalType: "bool",
                  name: "hasPaid",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "totalPaid",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "hasJoined",
                  type: "bool",
                },
              ],
              internalType: "struct Cuchulink.Participant[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "getRoundHistory",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "winner",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "hasWinner",
                  type: "bool",
                },
              ],
              internalType: "struct Cuchulink.Round[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "joinCuchubal",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "payForNextRound",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
  84532: {
    Cuchulink: {
      address: "0x47216272cC806D18F1E96dF02e9499430FBA84A2",
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "codigo",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "nombre",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "montoPorRonda",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "numParticipantes",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "creador",
              type: "address",
            },
          ],
          name: "CuchubalCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "codigo",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "participant",
              type: "address",
            },
          ],
          name: "ParticipantJoined",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "codigo",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "participant",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "PaymentMade",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "codigo",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "rondaActual",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "winner",
              type: "address",
            },
          ],
          name: "RoundCompleted",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "nombre",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "montoPorRonda",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "numParticipantes",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "createCuchubal",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "getCuchubalInfo",
          outputs: [
            {
              internalType: "string",
              name: "nombre",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "montoPorRonda",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "numParticipantes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "rondaActual",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "finished",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "creator",
              type: "address",
            },
          ],
          name: "getCuchubalesByCreator",
          outputs: [
            {
              internalType: "string[]",
              name: "",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "getParticipants",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
            {
              components: [
                {
                  internalType: "bool",
                  name: "hasPaid",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "totalPaid",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "hasJoined",
                  type: "bool",
                },
              ],
              internalType: "struct Cuchulink.Participant[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "getParticipantsPaid",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
            {
              components: [
                {
                  internalType: "bool",
                  name: "hasPaid",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "totalPaid",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "hasJoined",
                  type: "bool",
                },
              ],
              internalType: "struct Cuchulink.Participant[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "getRoundHistory",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "winner",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "hasWinner",
                  type: "bool",
                },
              ],
              internalType: "struct Cuchulink.Round[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "joinCuchubal",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "codigo",
              type: "string",
            },
          ],
          name: "payForNextRound",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
