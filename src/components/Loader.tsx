import React, { FC, ReactElement } from "react";
import { easeIn, easeOut, motion } from "framer-motion";
import LoadingImage from "../../public/3255337-removebg-preview.png";
import Image from "next/image";

type Props = {};

const Loader: FC<Props> = (props): ReactElement => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="relative w-[250px] md:w-[300px] h-[250px] md:h-[300px] rounded-lg overflow-hidden">
        <Image
          src={LoadingImage}
          alt="no access"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <h3 className="text-xl text-center font-normal">
        <span className="block h-6 w-6 rounded-full border-4 border-gray-500 border-b-transparent animate-spin"></span>
      </h3>
    </div>
  );
};

export default Loader;
