"server only";
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, liskSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, liskSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [liskSepolia.id]: http(),
  },
})

import { PinataSDK } from "pinata-web3";
export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});
