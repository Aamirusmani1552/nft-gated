import useSendPushMessage from "@/hooks/useSendPushMessage";
import React, { FC, ReactElement, useState } from "react";
import { IoSend } from "react-icons/io5";

type Props = {
  receiver: string;
};

const NewMessageInput: FC<Props> = ({ receiver }): ReactElement => {
  const { sendPushMessage } = useSendPushMessage();
  const [textMessage, setTextMessage] = useState<string>("");

  async function handleSendText() {
    textMessage.length > 0 &&
      sendPushMessage({
        message: textMessage,
        receiverAddress: receiver.replace("eip155:", ""),
      });
    setTextMessage("");
  }

  return (
    <div className="flex gap-2 items-center">
      <label
        htmlFor="new-message"
        className="bg-background px-4 py-4 rounded-full text-sm text-gray-700 flex-1"
      >
        <input
          type="text"
          name="new-message"
          id="new-message"
          className="bg-background outline-none border-none placeholder:text-gray-500"
          placeholder="type a message"
          value={textMessage}
          onChange={(e) => {
            setTextMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleSendText();
            }
          }}
        />
      </label>

      <button
        onClick={() => {
          handleSendText();
        }}
        className="text-white bg-primarySky w-12 h-12 flex items-center justify-center rounded-full"
      >
        <IoSend />
      </button>
    </div>
  );
};

export default NewMessageInput;
