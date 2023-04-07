import { useAddress, useMetamask, useSwitchChain } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import React from "react";
import { motion } from "framer-motion";
import { useChainId } from "@thirdweb-dev/react";
import Image from "next/image";
import metamaskImage from "../../public/metamask-icon.png";

type Props = {};

const ConnectWalletButton = (props: Props) => {
  const switchChain = useSwitchChain();
  const chainId = useChainId();
  const address = useAddress();
  const connectToMetamsk = useMetamask();

  if (address && chainId != ChainId.Mumbai) {
    return (
      <motion.button
        onClick={() => {
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

  return (
    <motion.button
      onClick={() => {
        if (address) return;
        connectToMetamsk();
      }}
      className="bg-primaryPurple text-white px-4 py-2 rounded-md"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {address ? (
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 relative text-sm">
            <Image
              alt="Metamask Account"
              src={metamaskImage}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <span className="text-xs">
            {address.slice(0, 5) + "..." + address.slice(-5)}
          </span>
        </div>
      ) : (
        "Connect Wallet"
      )}
    </motion.button>
  );
};

export default ConnectWalletButton;
