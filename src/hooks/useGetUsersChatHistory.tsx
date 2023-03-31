import { useAddress } from "@thirdweb-dev/react";
import React, { useState } from "react";
import useLocalStorage from "./useLocalStorage";
import usePushUser from "./usePushUser";
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { IFeeds, IMessageIPFS, IUser } from "@pushprotocol/restapi";

const useGetUsersChatHistory = () => {
  const address = useAddress();
  const { pushUser } = usePushUser();
  const { getLocalStorage } = useLocalStorage();
  const [chatHistory, setChatsHistory] = useState<IMessageIPFS[]>();

  async function getchatHistory(receiver: string) {
    try {
      if (!address) {
        return;
      }

      const userString = await getLocalStorage("push_user");
      let user;

      if (userString && userString.length > 0) {
        user = JSON.parse(userString) as IUser;
      } else {
        await pushUser();
        user = JSON.parse(await getLocalStorage("push_user")) as IUser;
      }

      //   // getting decrypted key
      const decryptedPvtKey = JSON.parse(
        await getLocalStorage("push_user_private")
      );

      // getting conversation has between two users
      const conversationHash = await PushAPI.chat.conversationHash({
        account: `eip155:${address}`,
        conversationId: `eip155:${receiver}`, // receiver's address or chatId of a group
        env: ENV.STAGING,
      });

      // getting chats
      const chatHistory = await PushAPI.chat.history({
        //@ts-ignore
        threadhash: conversationHash.threadHash,
        account: "eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7",
        limit: 30,
        toDecrypt: true,
        pgpPrivateKey: decryptedPvtKey,
        env: ENV.STAGING,
      });

      setChatsHistory(chatHistory);
      console.log(chatHistory);
    } catch (error) {
      const err = error as Error;
      alert(err.message);
      return;
    }
  }

  return { getchatHistory, chatHistory };
};

export default useGetUsersChatHistory;
