import useGetPushChatRequest from "@/hooks/useGetPushChatRequest";
import useGetPushChats from "@/hooks/useGetPushChats";
import usePushSocket from "@/hooks/usePushSocket";
import { ChainId, useAddress, useChainId } from "@thirdweb-dev/react";
import React, { FC, ReactElement, useEffect, useState } from "react";
import ChatCard from "./_chatCard";
import ChatDetail from "./_chatDetails";
import NoChat from "./NoChat";
import RequestCard from "./_requestCard";
import { IFeeds } from "@pushprotocol/restapi";

type Props = {};
enum Tabs {
  CHATS,
  REQUESTS,
}

const Chat: FC<Props> = (props): ReactElement => {
  const address = useAddress();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeChat, setActiveChat] = useState<string>("");
  const [activeChatData, setActiveChatData] = useState<IFeeds>();
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.CHATS);
  const { getPushChats, chats } = useGetPushChats();
  const { chatRequests, getPushChatRequests } = useGetPushChatRequest();
  const chainId = useChainId();
  const {
    sdkSocket,
    addSocketEvents,
    removeSocketEvents,
    isConnected,
    chatHistory,
    setChatsHistory,
    getchatHistory,
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
    getPushChatRequests();
  }, [address]);

  useEffect(() => {
    if (activeChat.length > 0) {
      getchatHistory(activeChat.replace("eip155:", ""));
    }
  }, [activeChat]);

  console.log(isConnected, sdkSocket);

  if (!address) {
    return (
      <p className="w-full text-center text-xl ">Please connect wallet first</p>
    );
  }

  if (chainId != ChainId.Mumbai) {
    return (
      <p className="w-full text-center text-xl ">
        Please connect to mumbai first
      </p>
    );
  }

  if (chats && chats.length == 0 && chatRequests && chatRequests.length == 0) {
    return <NoChat />;
  }

  return (
    <>
      {address && (
        <section className="flex px-8 py-2 gap-8 flex-1">
          {!activeChat ? (
            <div className="w-[300px] shadow-sm px-4 py-2 flex flex-col gap-2 rounded-lg h-fit bg-white">
              <div className="flex items-center justify-between text-sm py-2">
                <span
                  className={
                    activeTab == Tabs.CHATS
                      ? "text-center block flex-1 border-b-[3px] border-primaryPurple pb-2 cursor-pointer"
                      : "text-center block flex-1 pb-2 cursor-pointer border-b-[3px] border-transparent"
                  }
                  onClick={() => {
                    if (activeTab == Tabs.CHATS) return;
                    console.log("i ran");
                    setActiveTab(Tabs.CHATS);
                  }}
                >
                  Chats
                </span>
                <span
                  className={
                    activeTab == Tabs.REQUESTS
                      ? "text-center block flex-1 border-b-[3px] border-primaryPurple pb-2 cursor-pointer"
                      : "text-center block flex-1 pb-2 cursor-pointer border-b-[3px] border-transparent"
                  }
                  onClick={() => {
                    if (activeTab == Tabs.REQUESTS) return;
                    console.log("i ran");
                    setActiveTab(Tabs.REQUESTS);
                    console.log("i am here now");
                  }}
                >
                  Requests
                </span>
              </div>
              {activeTab == Tabs.CHATS && chats && chats?.length > 0 ? (
                chats?.map((i, k) => {
                  return (
                    <ChatCard
                      key={k}
                      details={i}
                      setIsChatOpen={setIsChatOpen}
                      setActiveChat={setActiveChat}
                      activeChat={activeChat}
                      setActiveChatData={setActiveChatData}
                    />
                  );
                })
              ) : activeTab == Tabs.REQUESTS &&
                chatRequests &&
                chatRequests?.length > 0 ? (
                chatRequests?.map((i, k) => {
                  return <RequestCard key={k} details={i} />;
                })
              ) : (
                <div className="py-4 text-xs text-gray-500 text-center">
                  {activeTab == Tabs.CHATS
                    ? "No Active Chat"
                    : "No Active Request"}
                </div>
              )}
            </div>
          ) : (
            <ChatDetail
              isChatOpen={isChatOpen}
              chatHistory={chatHistory}
              activeChat={activeChat}
              setChatsHistory={setChatsHistory}
              activeChatData={activeChatData}
              setActiveChat={setActiveChat}
            />
          )}
        </section>
      )}
    </>
  );
};

export default Chat;
