import useGetPushChatRequest from "@/hooks/useGetPushChatRequest";
import useGetPushChats from "@/hooks/useGetPushChats";
import useGetUsersChatHistory from "@/hooks/useGetUsersChatHistory";
import usePushSocket from "@/hooks/usePushSocket";
import { ChainId, useAddress, useChainId } from "@thirdweb-dev/react";
import React, { FC, ReactElement, useEffect, useState } from "react";
import ChatCard from "./_chatCard";
import ChatDetail from "./_chatDetails";

type Props = {};

const Chat: FC<Props> = (props): ReactElement => {
  const address = useAddress();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeChat, setActiveChat] = useState<string>("");
  const { getPushChats, chats } = useGetPushChats();
  const { getchatHistory, chatHistory, setChatsHistory } =
    useGetUsersChatHistory();
  const chainId = useChainId();
  const {
    sdkSocket,
    addSocketEvents,
    removeSocketEvents,
    isConnected,
    newMessage,
  } = usePushSocket();

  useEffect(() => {
    if (sdkSocket) {
      addSocketEvents();
    }
    return () => {
      removeSocketEvents();
    };
  }, [sdkSocket]);

  useEffect(() => {
    if (!address) return;
    if (chats && chats?.length > 0) return;
    getPushChats();
  }, [address]);

  useEffect(() => {
    if (activeChat.length > 0) {
      getchatHistory(activeChat.replace("eip155:", ""));
    }
  }, [activeChat]);

  useEffect(() => {
    if (!newMessage) return;
    console.log("i am in here");
    let oldChats = chatHistory;
    oldChats?.push(newMessage);
    setChatsHistory(oldChats);
  }, [newMessage]);
  console.log(newMessage, "is the new message recieved");

  if (!address) {
    return (
      <p className="w-full text-center text-xl ">Please connect wallet first</p>
    );
  }

  if (!chats || chats.length == 0) {
    return <p className="w-full text-center text-xl ">No chats available</p>;
  }

  if (chainId != ChainId.Mumbai) {
    return (
      <p className="w-full text-center text-xl ">
        Please connect to mumbai first
      </p>
    );
  }

  return (
    <>
      {address && (
        <section className="flex px-8 py-2 gap-8 flex-1">
          <div className="w-[300px] shadow-sm px-4 py-2 flex flex-col gap-2 rounded-lg h-fit bg-white">
            {chats?.map((i, k) => {
              return (
                <ChatCard
                  key={k}
                  details={i}
                  setIsChatOpen={setIsChatOpen}
                  setActiveChat={setActiveChat}
                  activeChat={activeChat}
                />
              );
            })}
          </div>
          <ChatDetail
            isChatOpen={isChatOpen}
            latestChats={chatHistory}
            setChatsHistory={setChatsHistory}
          />
        </section>
      )}
    </>
  );
};

export default Chat;
