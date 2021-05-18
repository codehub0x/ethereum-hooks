import { useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Token, WETH, Fetcher, Route } from "@uniswap/sdk";
import usePoller from "./Poller";

export default function useExchangePrice(
  targetNetwork: any,
  mainnetProvider: Web3Provider,
  pollTime?: number
) {
  const [price, setPrice] = useState(0);

  const pollPrice = () => {
    async function getPrice() {
      if(targetNetwork.price){
        setPrice(targetNetwork.price)
      }else{
        const DAI = new Token(
          mainnetProvider.network ? mainnetProvider.network.chainId : 1,
          "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          18,
        );
        const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId], mainnetProvider);
        const route = new Route([pair], WETH[DAI.chainId]);
        setPrice(parseFloat(route.midPrice.toSignificant(6)));
      }
    }
    getPrice();
  };
  usePoller(pollPrice, pollTime || 9777);

  return price;
}
