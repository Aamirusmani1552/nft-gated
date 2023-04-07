import { useState, useEffect } from "react";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import { ENV } from "@pushprotocol/socket/src/lib/constants";
import { IMessageIPFS } from "@pushprotocol/restapi";
import { useAddress } from "@thirdweb-dev/react";
import useGetUsersChatHistory from "./useGetUsersChatHistory";
import useDecryptPushChats from "./useDecryptPushChats";
import useDecryptSingleChat from "./useDecryptSingleChat";
import { error } from "console";

function usePushSocket() {
  const [sdkSocket, setSDKSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(sdkSocket?.connected);
  const { chatHistory, getchatHistory, setChatsHistory } =
    useGetUsersChatHistory();
  const address = useAddress();
  const { decryptChat } = useDecryptSingleChat();

  const addSocketEvents = () => {
    console.log("adding events...");
    sdkSocket?.on(EVENTS.CONNECT, () => {
      console.log("connected");
      setIsConnected(true);
    });

    sdkSocket?.on(EVENTS.DISCONNECT, () => {
      console.log("disconnected");
      setIsConnected(false);
    });

    sdkSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message: IMessageIPFS) => {
      console.log(message);
      const decryptedChat = decryptChat(message)
        .then((data) => {
          if (data) setChatsHistory((prev) => [data, ...prev]);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    });

    console.log("events added");
  };

  console.log(chatHistory, "will be the new chat history");

  const removeSocketEvents = () => {
    sdkSocket?.off(EVENTS.CONNECT);
    sdkSocket?.off(EVENTS.DISCONNECT);
  };

  const toggleConnection = () => {
    if (sdkSocket?.connected) {
      sdkSocket.disconnect();
    } else {
      sdkSocket.connect();
    }
  };

  useEffect(() => {
    if (!address) return;
    const connectionObject = createSocketConnection({
      user: `eip155:${address}`,
      env: ENV.STAGING,
      socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
      socketType: "chat",
    });

    setSDKSocket(connectionObject);

    return () => {
      if (sdkSocket) {
        sdkSocket.disconnect();
      }
    };
  }, [address]);

  return {
    sdkSocket,
    removeSocketEvents,
    addSocketEvents,
    toggleConnection,
    isConnected,
    chatHistory,
    setChatsHistory,
    getchatHistory,
  };
}

export default usePushSocket;
