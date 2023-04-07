import { useAddress } from "@thirdweb-dev/react";
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import useLocalStorage from "./useLocalStorage";
import usePushUser from "./usePushUser";
import { IMessageIPFS, IUser } from "@pushprotocol/restapi";
import { useState } from "react";
import { toast } from "react-hot-toast";

const useGetLatestPushChatMessage = () => {
  const address = useAddress();
  const { getLocalStorage } = useLocalStorage();
  const { pushUser } = usePushUser();
  const [latestChats, setLatestChats] = useState<IMessageIPFS[]>();

  async function getLatestChats(account: string) {
    try {
      if (!address) {
        alert("Connect wallet first");
        return;
      }

      //getting the user encrypted details
      const userString = await getLocalStorage("push_user");
      let user;

      if (userString && userString.length > 0) {
        user = JSON.parse(userString) as IUser;
      } else {
        await pushUser();
        user = JSON.parse(await getLocalStorage("push_user")) as IUser;
      }

      // getting decrypted key
      const decryptedPvtKey = JSON.parse(
        await getLocalStorage("push_user_private")
      );

      const conversationHash = await PushAPI.chat.conversationHash({
        account: `eip155:${address}`,
        conversationId: `eip155:${account}`, // receiver's address or chatId of a group
        env: ENV.STAGING,
      });

      // actual api
      const chatHistory = await PushAPI.chat.latest({
        //@ts-ignore
        threadhash: conversationHash.threadHash,
        account: `eip155:${address}`,
        toDecrypt: true,
        pgpPrivateKey: decryptedPvtKey,
        env: ENV.STAGING,
      });

      setLatestChats(chatHistory);
    } catch (error) {
      const err = error as Error;
      toast.error(err.name);
      return;
    }
  }

  return { getLatestChats, latestChats };
};

export default useGetLatestPushChatMessage;
