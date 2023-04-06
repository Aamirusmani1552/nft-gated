import { useState, useEffect } from "react";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import { ENV } from "@pushprotocol/socket/src/lib/constants";
import { ChainId } from "@thirdweb-dev/sdk";
import { IFeeds } from "@pushprotocol/restapi";
import { useAddress } from "@thirdweb-dev/react";

function usePushSocket() {
  const [sdkSocket, setSDKSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(sdkSocket?.connected);
  const address = useAddress();

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

    sdkSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message: IFeeds) =>
      console.log(message)
    );

    console.log("events added");
  };

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
      socketOptions: { autoConnect: false, reconnectionAttempts: 3 },
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
  };
}

export default usePushSocket;
