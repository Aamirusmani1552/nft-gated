import React, {
  ChangeEvent,
  FC,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { useAddress } from "@thirdweb-dev/react";
import { initializeWhales } from "@/helper";
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
  const [utility, setUtility] = useState<NftValidationUtility | undefined>(
    undefined
  );
  const [step, setStep] = useState<number | undefined>(undefined);

  const init = async () => {
    const whal3s = new Whal3s();
    const _utility = await whal3s.createValidationUtility(
      "bf20e171-09f2-433a-8e29-084f70230fdc"
    );
    _utility.addEventListener("stepChanged", () => {
      setStep(_utility.step);
    });
    setStep(_utility.step);
    setUtility(_utility);
  };

  useEffect(() => {
    init();
  }, []);

  function handleClick(
    e: React.MouseEvent<HTMLElement, globalThis.MouseEvent>
  ) {
    if (e.target != modalRef.current) {
      setShowAccessModal(false);
    }
  }

  console.log(step, "is the step");

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
      ></motion.div>
    </section>
  );
};

export default AccessModal;
