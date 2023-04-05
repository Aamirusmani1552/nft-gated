import React, { FC, ReactElement, useState, useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { easeInOut, motion } from "framer-motion";
import Whal3s, { NftValidationUtility } from "@whal3s/whal3s.js";
import { useAddress } from "@thirdweb-dev/react";
import ConnectWithWhalesWallet from "./_connectWithWhalesWallet";
import Step3Whales from "./Step3Whales";
import Step2Whales from "./Step2Whales";
import Step5Whales from "./Step5Whales";

type Props = {
  setHasAccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const AccessPage: FC<Props> = ({ setHasAccess }): ReactElement => {
  const address = useAddress();
  const [utility, setUtility] = useState<NftValidationUtility>();
  const [step, setStep] = useState<number>();

  const init = async () => {
    if (!address) {
      return;
    }

    const whal3s = new Whal3s();
    const _utility = await whal3s.createValidationUtility(
      "805ce22c-c3bf-42d0-8e33-2db151302b5c"
    );
    _utility.addEventListener("stepChanged", () => {
      console.log("step changed to", _utility.step);
      setStep(_utility.step);
    });

    console.log("current step", _utility.step);
    setUtility(_utility);
    setStep(_utility.step);
  };

  useEffect(() => {
    if (!address) return;
    init();
  }, [address]);

  useEffect(() => {
    if (step == NftValidationUtility.STEP_CLAIMED) {
      setHasAccess(true);
    }
  }, [step]);

  return (
    <section className="w-full flex-1 z-10 font-semibold text-4xl md:text-5xl flex flex-col items-center justify-center gap-4 relative">
      {utility && utility.step == NftValidationUtility.STEP_INITIALIZED ? (
        <ConnectWithWhalesWallet utility={utility} />
      ) : utility && utility.step == NftValidationUtility.STEP_NFTS_FETCHED ? (
        <Step3Whales utility={utility} />
      ) : utility && utility.step == NftValidationUtility.STEP_RESERVED ? (
        <Step5Whales utility={utility} />
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
};

export default AccessPage;
