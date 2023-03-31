import React, { useEffect, useState } from "react";
import Whal3s, { NftValidationUtility } from "@whal3s/whal3s.js";

const UtilityComponent = () => {
  const [utility, setUtility] = useState<NftValidationUtility | undefined>(
    undefined
  );
  const [step, setStep] = useState<number | undefined>(undefined);

  const init = async () => {
    const whal3s = new Whal3s();
    const _utility = await whal3s.createValidationUtility(
      process.env.whal3sUtilityId ?? ""
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
};

export default UtilityComponent;
