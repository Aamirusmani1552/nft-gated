import React, { FC, ReactElement, useState } from "react";
import { motion } from "framer-motion";
import useSendPushMessage from "@/hooks/useSendPushMessage";

type Props = {};

const NoChat: FC<Props> = (props): ReactElement => {
  const [receiverAddress, setReceiverAddress] = useState<string>();
  const [message, setMessage] = useState<string>();
  const { sendPushMessage } = useSendPushMessage();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <section className="flex items-center flex-col justify-center flex-1 px-8">
      <div className="shadow-md w-full max-w-[600px] p-8 bg-white rounded-lg flex flex-col items-center gap-4">
        <h3 className="text-xl md:text-3xl font-semibold text-gray-700">
          You have No Chats
        </h3>
        <p className="text-xs pb-4 mb-2">Send message request to an Address</p>

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
                  sendPushMessage({
                    message,
                    receiverAddress,
                    messageType: "Text",
                  });
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
      </div>
    </section>
  );
};

export default NoChat;
