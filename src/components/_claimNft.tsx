import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import NotAccessImage from "../../public/Tiny_people_standing_near_stop_sign_flat_vector_illustration-removebg-preview.png";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { toast } from "react-hot-toast";

type Props = {};

const ClaimNFT = (props: Props) => {
  const address = useAddress();
  const [loading, setLoading] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<string>("-");
  const { contract, data } = useContract(
    "0x7e4Ea0A7Cb44ef7Cb9f9af67fF7ad27900af5429"
  );

  async function getClaimed() {
    if (!contract) return;
    const token = await contract.call<string>("getCurrentTokenId");
    setClaimed(token);
  }

  useEffect(() => {
    if (!contract) return;
    getClaimed();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[250px] md:w-[300px] h-[250px] md:h-[300px] rounded-lg overflow-hidden">
        <Image
          src={NotAccessImage}
          alt="no access"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <h3 className="text-lg md:text-xl text-center max-w-[300px] md:max-w-full">
        You dont seem to have an Access Pass. Claim here &#128071;
      </h3>
      <motion.button
        className=" bg-primaryPurple text-white px-4 py-2 font-normal tracking-wider text-lg rounded-md border-none outline-none relative mt-2 flex gap-2 items-center justify-center before:w-full before:h-full before:absolute before:border-2 before:border-primaryPurple before:left-1 before:bg-transparent before:z-0 before:top-1 before:rounded-md disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={loading}
        onClick={async () => {
          if (!address) return;
          setLoading(true);
          try {
            await contract?.call("mintAccessNFT", address);
            toast.success("Successfully claimed");
            typeof window != undefined && location.reload();
          } catch (err) {
            toast.error("An error occured while claiming");
          }
          setLoading(false);
        }}
      >
        <span>{!loading ? "Claim Pass" : "Loading"}</span>
        {loading && (
          <span className="block h-4 w-4 border-2 rounded-full border-b-transparent animate-spin"></span>
        )}
      </motion.button>
      <span className="text-sm py-4 text-primaryPurple">
        {claimed} / 500 claimed
      </span>
    </div>
  );
};

export default ClaimNFT;
