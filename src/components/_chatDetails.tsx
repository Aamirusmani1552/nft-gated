import Image from "next/image";
import React, { FC, ReactElement, useEffect, useRef } from "react";
import ChatTextMessage from "./_chatMessage";
import NewMessageInput from "./_createNewMessage";
import chatImage from "../../public/4112338.jpg";
import { IMessageIPFS } from "@pushprotocol/restapi";
import { useAddress } from "@thirdweb-dev/react";
import * as PushAPI from "@pushprotocol/restapi";
import { IoIosArrowBack } from "react-icons/io";

type Props = {
  isChatOpen: boolean;
  chatHistory: IMessageIPFS[];
  setChatsHistory: React.Dispatch<React.SetStateAction<PushAPI.IMessageIPFS[]>>;
  activeChat: string;
  activeChatData: PushAPI.IFeeds | undefined;
  setActiveChat: React.Dispatch<React.SetStateAction<string>>;
};

const ChatDetail: FC<Props> = ({
  isChatOpen,
  chatHistory,
  activeChat,
  setChatsHistory,
  activeChatData,
  setActiveChat,
}): ReactElement => {
  const messgesRef = useRef<HTMLDivElement>(null);
  const address = useAddress();

  useEffect(() => {
    if (!messgesRef.current) return;

    console.log(window.screen.height);
    messgesRef.current.style.height = `${window.screen.height - 250}`;
  }, [messgesRef]);

  return (
    <div className="flex-1 max-w-[500px] max-h-[600px] w-full flex flex-col grid-rows-[7] shadow-sm px-4 py-2 rounded-lg bg-white">
      {isChatOpen ? (
        <>
          {activeChatData && (
            <div className="flex items-center gap-2 text-gray-500 font-semibold py-2 border-b-[1px] mb-2">
              <div
                className="text-xl text-gray-500 p-2 cursor-pointer"
                onClick={() => {
                  setActiveChat("");
                  setChatsHistory([]);
                }}
              >
                <IoIosArrowBack />
              </div>
              <div className="w-8 h-8 relative rounded-full overflow-hidden">
                <Image
                  src={activeChatData.profilePicture!}
                  alt="profile_pic"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="text-sm flex items-center">
                {activeChatData.did.replace("eip155:", "").slice(0, 5) +
                  "..." +
                  activeChatData.did.slice(-5)}
              </div>
            </div>
          )}
          <div
            ref={messgesRef}
            className=" flex-1  no-overflow scrollbar-track-transparent scrollbar-thin scrollbar-thumb-background  flex flex-col-reverse pb-2 gap-3 overflow-y-scroll"
          >
            {chatHistory.length > 0 ? (
              chatHistory.map((i, k) => {
                console.log(i.messageType);
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
              <div className="w-full h-full flex-1 flex items-center justify-center">
                <div className="w-10  h-10 border-4 rounded-full border-b-transparent animate-spin border-gray-500"></div>
              </div>
            )}
          </div>
          {chatHistory && (
            <NewMessageInput
              receiver={activeChat ? activeChat : ""}
              setChatsHistory={setChatsHistory}
            />
          )}
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
