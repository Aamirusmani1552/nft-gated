import React, { FC, ReactElement } from "react";
import { BsArrowRight } from "react-icons/bs";
import { easeInOut, motion } from "framer-motion";

const parentVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 4 / 3,
    },
  },
};

const childrenVariant = {
  hidden: {},
  visible: {
    y: [100, 0, -100],
    opacity: [0, 1, 0],
    transition: {
      y: {
        repeat: Infinity,
        ease: easeInOut,
        duration: 4,
      },
      opacity: {
        repeat: Infinity,
        duration: 4,
      },
    },
  },
};

type Props = {
  setShowAccessModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AccessPage: FC<Props> = (props): ReactElement => {
  return (
    <section className="w-full flex-1 z-10 font-semibold text-4xl md:text-5xl flex flex-col items-center justify-center gap-4 relative">
      <div className="text-center max-w-[900px] px-8 w-full leading-tight">
        Connect with Amazing community of Artists and developers
      </div>
      <motion.div
        variants={parentVariant}
        className="w-full h-12 text-4xl overflow-hidden relative text-primarySky"
        animate="visible"
        initial="hidden"
      >
        <motion.div
          className="absolute text-center w-full"
          variants={childrenVariant}
        >
          Create
        </motion.div>
        <motion.div
          className="absolute text-center w-full"
          variants={childrenVariant}
        >
          Share
        </motion.div>
        <motion.div
          className="absolute text-center w-full"
          variants={childrenVariant}
        >
          Collaborate
        </motion.div>
      </motion.div>

      <div className=" px-5">
        <motion.button
          className=" bg-primaryPurple text-white px-4 py-2 font-normal tracking-wider text-lg rounded-md border-none outline-none relative mt-2 flex gap-2 items-center justify-center
      before:w-full before:h-full before:absolute before:border-2 before:border-primaryPurple before:left-1 before:bg-transparent before:z-0 before:top-1 before:rounded-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => props.setShowAccessModal(true)}
        >
          <span>Check Access</span>
          <BsArrowRight />
        </motion.button>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="fixed bottom-0  md:bottom-[-50px] z-[-1]"
      >
        <path
          fill="#94C4C6"
          fillOpacity="1"
          d="M0,192L26.7,165.3C53.3,139,107,85,160,96C213.3,107,267,181,320,208C373.3,235,427,213,480,181.3C533.3,149,587,107,640,90.7C693.3,75,747,85,800,106.7C853.3,128,907,160,960,176C1013.3,192,1067,192,1120,192C1173.3,192,1227,192,1280,192C1333.3,192,1387,192,1413,192L1440,192L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
        ></path>
      </svg>
    </section>
  );
};

export default AccessPage;
