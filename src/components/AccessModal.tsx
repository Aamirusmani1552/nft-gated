import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAddress } from "@thirdweb-dev/react";
import Whal3s, { NftValidationUtility } from "@whal3s/whal3s.js";

type Props = {
  setShowAccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHasAccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const AccessModal: FC<Props> = ({
  setShowAccessModal,
  setHasAccess,
}): ReactElement => {
  const modalRef = useRef(null);
  const address = useAddress();
  const [step, setStep] = useState<number | undefined>(undefined);
  const [utility, setUtility] = useState<NftValidationUtility | undefined>();

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

  function handleClick(
    e: React.MouseEvent<HTMLElement, globalThis.MouseEvent>
  ) {
    if (e.target != modalRef.current) {
      setShowAccessModal(false);
    }
  }

  return (
    <section
      onClick={(e) => {
        handleClick(e);
      }}
      className="w-screen px-8 h-screen flex items-center bg-[#505355c3] justify-center fixed top-0 z-20  backdrop-blur-sm"
    >
      <motion.div
        ref={modalRef}
        className="w-full h-[300px] rounded-md bg-white max-w-[700px] shadow-md"
        initial={{ y: "-100vh" }}
        animate={{ y: 0 }}
      >
        <button
          onClick={() => {
            if (
              utility &&
              utility.step == NftValidationUtility.STEP_INITIALIZED
            ) {
              utility.connectWallet();
            }
          }}
          className="bg-primaryPurple py-2 px-4 rounded-md text-white"
        >
          Connect wallet
        </button>
      </motion.div>
    </section>
  );
};

export default AccessModal;
