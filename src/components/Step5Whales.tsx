import React, { FC, ReactElement, useState } from "react";
import welcomeImage from "../../public/2803207-removebg-preview.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { NftValidationUtility } from "@whal3s/whal3s.js";
type Props = {
  utility: NftValidationUtility;
};

const Step5Whales: FC<Props> = ({ utility }): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div className="flex flex-col items-center mb-12">
      <div className="relative w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-lg overflow-hidden">
        <Image
          src={welcomeImage}
          alt="no access"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <motion.button
        className=" bg-primaryPurple text-white px-4 py-2 font-normal tracking-wider text-lg rounded-md border-none outline-none relative mt-2 flex gap-2 items-center justify-center before:w-full before:h-full before:absolute before:border-2 before:border-primaryPurple before:left-1 before:bg-transparent before:z-0 before:top-1 before:rounded-md disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await utility.storeEngagement();
          setLoading(false);
        }}
      >
        Open App
      </motion.button>
    </div>
  );
};

export default Step5Whales;
