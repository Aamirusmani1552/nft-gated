import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAddress } from "@thirdweb-dev/react";
import Whal3s, { NftValidationUtility } from "@whal3s/whal3s.js";
import useSendPushMessage from "@/hooks/useSendPushMessage";
import { toast } from "react-hot-toast";

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewChatModal: FC<Props> = ({ setShowModal }): ReactElement => {
  const modalRef = useRef(null);
  const address = useAddress();
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { sendPushMessage } = useSendPushMessage();
  const [loading, setLoading] = useState<boolean>(false);

  function handleClick(
    e: React.MouseEvent<HTMLElement, globalThis.MouseEvent>
  ) {
    console.log(e.target != modalRef.current, "is our result of camparison");
    console.log(e.target, modalRef.current);
    if (e.target != modalRef.current) {
      setShowModal(false);
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
        className="w-full py-4 px-4 rounded-md bg-white max-w-[600px] shadow-md"
        initial={{ y: "-100vh" }}
        animate={{ y: 0 }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h3 className="text-xl font-semibold pb-8 text-gray-700 text-center">
          Send Request An Address
        </h3>
        <div className="w-full flex flex-col items-center gap-4">
          <label
            htmlFor="new_chat"
            className=" w-full flex-col md:max-w-[80%] gap-2 flex"
          >
            <span className=" text-gray-500 text-sm w-full">
              Ethereum Address
            </span>
            <input
              type="text"
              name="new_chat"
              id="new_chat"
              className="outline-none border-2 disabled:cursor-not-allowed border-gray-500 focus:border-primarySky px-4 py-2 rounded-md w-full text-sm md:text-base text-gray-700"
              value={receiverAddress}
              disabled={loading}
              onChange={(e) => {
                setReceiverAddress(e.target.value);
              }}
            />
          </label>
          <label
            htmlFor="new_message"
            className=" w-full flex-col md:max-w-[80%] gap-2 flex"
          >
            <span className="text-gray-500 text-sm w-full">Message</span>
            <input
              type="text"
              name="new_message"
              id="new_message"
              className="outline-none border-2 disabled:cursor-not-allowed border-gray-500 focus:border-primarySky px-4 py-2 rounded-md w-full text-sm md:text-base text-gray-700"
              value={message}
              disabled={loading}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </label>
          <div>
            <motion.button
              className=" bg-primaryPurple disabled:cursor-not-allowed text-white px-4 py-2 font-normal tracking-wider text-lg rounded-md border-none outline-none relative mt-2 flex gap-2 items-center justify-center before:w-full before:h-full before:absolute before:border-2 before:border-primaryPurple before:left-1 before:bg-transparent before:z-0 before:top-1 before:rounded-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={loading}
              onClick={async () => {
                if (
                  receiverAddress &&
                  receiverAddress.length <= 42 &&
                  message
                ) {
                  setLoading(true);
                  try {
                    sendPushMessage({
                      message,
                      receiverAddress,
                      messageType: "Text",
                    });
                    toast.success("Message Request Sent");
                  } catch (error) {
                    toast.error("An error occured. Try refreshing page.");
                  }
                  setMessage("");
                  setReceiverAddress("");
                  setLoading(false);
                }
              }}
            >
              <span>{loading ? "Sending" : "Send Request"}</span>
              {loading && (
                <span className="block h-4 w-4 border-2 border-b-transparent animate-spin rounded-full"></span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default NewChatModal;
