import { IFeeds } from "@pushprotocol/restapi";
import Image from "next/image";
import React, { FC, ReactElement } from "react";
import exampleImage from "../../public/nature.png";
import dateFormat, { masks } from "dateformat";

type Props = {
  details: IFeeds;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveChat: React.Dispatch<React.SetStateAction<string>>;
  activeChat: string;
};

const ChatCard: FC<Props> = ({
  details,
  setIsChatOpen,
  setActiveChat,
  activeChat,
}): ReactElement => {
  return (
    <div
      className="bg-white border-b-[1px] border-gray-100 flex items-center gap-2 py-2 cursor-pointer last-item"
      onClick={async () => {
        if (activeChat == details.did) return;
        setIsChatOpen(true);
        setActiveChat(details.did);
      }}
    >
      <div className="relative w-12 h-12 rounded-full ">
        <Image
          src={details.profilePicture ? details.profilePicture : exampleImage}
          alt="profile"
          style={{ objectFit: "contain" }}
          className="rounded-full"
          fill
        />
        <div className="absolute p-[2px] rounded-full  right-0 bottom-0 bg-white">
          <div className="bg-primaryGreen w-3 h-3 rounded-full"></div>
        </div>
      </div>

      {/* info */}
      <div className="flex flex-col flex-1 ">
        <span className=" flex text-sm font-semibold text-gray-700">
          <span className="flex-1">
            {details.did.replace("eip155:", "").slice(0, 5) +
              "..." +
              details.did.replace("eip155:", "").slice(-5)}
          </span>
          <span className="text-xs text-gray-500">
            {typeof window != undefined &&
              dateFormat(new Date(details.intentTimestamp), "hh:MM")}
          </span>
        </span>
        <span className="truncate text-xs text-gray-500">
          {details.msg.messageContent}
        </span>
      </div>
    </div>
  );
};

export default ChatCard;
