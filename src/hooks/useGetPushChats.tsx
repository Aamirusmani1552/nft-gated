import { useAddress } from "@thirdweb-dev/react";
import React, { useState } from "react";
import useLocalStorage from "./useLocalStorage";
import usePushUser from "./usePushUser";
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { IFeeds, IUser } from "@pushprotocol/restapi";

const useGetPushChats = () => {
  const address = useAddress();
  const { pushUser } = usePushUser();
  const { getLocalStorage } = useLocalStorage();
  const [chats, setChats] = useState<IFeeds[]>();

  async function getPushChats() {
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

      // getting chats
      const chats = await PushAPI.chat.chats({
        account: `eip155:${address}`,
        toDecrypt: true,
        pgpPrivateKey: decryptedPvtKey,
        env: ENV.STAGING,
      });

      setChats(chats);
      console.log(chats);
    } catch (error) {
      const err = error as Error;
      alert(err.message);
      return;
    }
  }

  return { getPushChats, chats };
};

export default useGetPushChats;
