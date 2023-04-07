import React from "react";

const NoWalletPrompt: React.FC = (): React.ReactElement => {
  return (
    <div className="text-center  text-gray-500 flex items-center justify-center">
      <h3 className="bg-white px-8 py-6 mt-8 w-fit rounded-md border-[1px] shadow-md">
        Please Connect Your Wallet first
      </h3>
    </div>
  );
};

export default NoWalletPrompt;
