import Image from "next/image";
import React, { FC, ReactElement, useEffect, useRef } from "react";
import ChatTextMessage from "./_chatMessage";
import NewMessageInput from "./_createNewMessage";
import chatImage from "../../public/4112338.jpg";
import { IMessageIPFS } from "@pushprotocol/restapi";
import { useAddress } from "@thirdweb-dev/react";
import * as PushAPI from "@pushprotocol/restapi";

type Props = {
  isChatOpen: boolean;
  latestChats: IMessageIPFS[] | undefined;
  setChatsHistory: React.Dispatch<
    React.SetStateAction<PushAPI.IMessageIPFS[] | undefined>
  >;
};

const ChatDetail: FC<Props> = ({ isChatOpen, latestChats }): ReactElement => {
  const messgesRef = useRef<HTMLDivElement>(null);
  const address = useAddress();

  useEffect(() => {
    if (!messgesRef.current) return;

    messgesRef.current.style.height = `${window.screen.height - 116}`;
  }, [messgesRef]);

  return (
    <div className="flex-1 flex flex-col grid-rows-[7] shadow-sm px-4 py-2 rounded-lg bg-white">
      {isChatOpen ? (
        <>
          <div
            ref={messgesRef}
            className=" flex-1  no-overflow scrollbar-track-transparent scrollbar-thin scrollbar-thumb-background  flex flex-col-reverse pb-2 gap-3 overflow-y-scroll"
          >
            {latestChats ? (
              latestChats?.map((i, k) => {
                return (
                  <ChatTextMessage
                    key={k}
                    message={i.messageContent}
                    sentByMe={i.fromDID == `eip155:${address}`}
                    messageType={i.messageType}
                  />
                );
              })
            ) : (
              <div className="w-10  h-10 border-4 rounded-full"></div>
            )}
          </div>
          {latestChats && <NewMessageInput receiver={latestChats[0].toDID} />}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="relative w-[250px] md:w-[400px] h-[250px] md:h-[400px]">
            <Image
              src={chatImage}
              alt="chat_image"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <p className=" text-primaryGreen text-sm">Click Chats to open here</p>
        </div>
      )}
    </div>
  );
};

export default ChatDetail;
