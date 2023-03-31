import {
  ConnectWallet,
  useAddress,
  useSDK,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import React from "react";
import { motion } from "framer-motion";
import { useChainId } from "@thirdweb-dev/react";

type Props = {};

const ConnectWalletButton = (props: Props) => {
  const switchChain = useSwitchChain();
  const chainId = useChainId();
  const address = useAddress();

  if (address && chainId != ChainId.Mumbai) {
    return (
      <motion.button
        onClick={() => {
          console.log("in herer");
          switchChain(ChainId.Mumbai);
        }}
        className="px-4 py-2 bg-primaryPurple text-white rounded-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Switch Network
      </motion.button>
    );
  }

  return <ConnectWallet />;
};

export default ConnectWalletButton;
