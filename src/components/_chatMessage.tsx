import { IMessageIPFS } from "@pushprotocol/restapi";
import Image from "next/image";
import React, { FC, ReactElement } from "react";

type MessageTypes = "Text" | "Image" | "File" | "GIF" | "MediaURL";

type Props = {
  sentByMe: boolean;
  message: string;
  messageType: IMessageIPFS["messageType"];
};

const ChatTextMessage: FC<Props> = ({
  sentByMe = true,
  message = "",
  messageType,
}): ReactElement => {
  return (
    <div
      className={
        sentByMe
          ? "bg-background  rounded-lg max-w-[250px] md:max-w-[400px] text-gray-700 text-sm self-start rounded-tl-none w-fit p-4"
          : "bg-primaryPurple text-white text-sm max-w-[250px] md:max-w-[400px] rounded-lg self-end rounded-tr-none w-fit p-4"
      }
    >
      {messageType == "Text" ? (
        <p>{message}</p>
      ) : messageType == "Image" ? (
        <div className="w-[250px] h-[250px] relative">
          <Image src={""} alt={message.slice(0, 10) + "chatSynergy"} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ChatTextMessage;
