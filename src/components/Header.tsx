import { useAddress } from "@thirdweb-dev/react";
import React, { FC, ReactElement } from "react";
import ConnectWalletButton from "./_connectWallet";
import { motion } from "framer-motion";
import Link from "next/link";

type Props = {};

const Header: FC<Props> = (props): ReactElement => {
  const address = useAddress();

  return (
    <header className="w-full px-2 md:px-8 flex items-center justify-between h-[64px]">
      <Link href={"/"}>
        <div className="text-xl font-bold select-none cursor-pointer">
          <motion.span className="bg-primarySky text-white pl-2 py-1 rounded-full">
            Sy
          </motion.span>
          <motion.span>nergy</motion.span>
        </div>
      </Link>
      {/* <div className="w-fit">
        <ConnectWalletButton />
      </div> */}
    </header>
  );
};

export default Header;
