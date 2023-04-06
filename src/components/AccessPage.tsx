import React, { FC, ReactElement, useState, useEffect } from "react";
import Whal3s, { NftValidationUtility } from "@whal3s/whal3s.js";
import { useAddress } from "@thirdweb-dev/react";
import ConnectWithWhalesWallet from "./_connectWithWhalesWallet";
import Step3Whales from "./Step3Whales";
import Step5Whales from "./Step5Whales";
import Loader from "./Loader";

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

    const whal3s = new Whal3s({
      accountCenter: {
        desktop: {
          minimal: true,
          enabled: true,
          position: "bottomLeft",
        },
        mobile: {
          enabled: false,
        },
      },
    });
    const _utility = await whal3s.createValidationUtility(
      "5067db0d-94b0-4866-ae4f-a9cf920809b0"
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

  if (!utility) {
    return (
      <div className="w-full flex-1 z-10 font-semibold text-4xl md:text-5xl flex flex-col items-center justify-center gap-4 relative">
        <Loader />
      </div>
    );
  }

  return (
    <section className="w-full flex-1 z-10 font-semibold text-4xl md:text-5xl flex flex-col items-center justify-center gap-4 relative">
      {step == NftValidationUtility.STEP_INITIALIZED && (
        <ConnectWithWhalesWallet utility={utility} />
      )}

      {step == NftValidationUtility.STEP_NFTS_FETCHED && (
        <Step3Whales utility={utility} />
      )}

      {step == NftValidationUtility.STEP_RESERVED && (
        <Step5Whales utility={utility} />
      )}
      {(step == NftValidationUtility.STEP_TOKEN_SELECTED ||
        step == NftValidationUtility.STEP_UNINITIALIZED ||
        step == NftValidationUtility.STEP_WALLET_CONNECTED ||
        step == NftValidationUtility.STEP_CLAIMED) && (
        <div>
          <Loader />
        </div>
      )}
    </section>
  );
};

export default AccessPage;
