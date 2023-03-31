import { getEthereumSigner } from "@/helper";
import { useAddress } from "@thirdweb-dev/react";
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import useLocalStorage from "./useLocalStorage";
import usePushUser from "./usePushUser";
import { IMessageIPFS, IUser } from "@pushprotocol/restapi";
import { useState } from "react";

const useDecryptPushChats = () => {
  const address = useAddress();
  const { getLocalStorage } = useLocalStorage();
  const { pushUser } = usePushUser();
  const [decryptedChats, setDecryptedChats] = useState<IMessageIPFS[]>();

  async function decryptChats(account: string) {
    try {
      if (!address) {
        alert("Connect wallet first");
        return;
      }

      //getting signer
      const signer = await getEthereumSigner();

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

      // chat history but with decrypt helper so everything is encrypted
      const encryptedChats = await PushAPI.chat.history({
        //@ts-ignore
        threadhash: conversationHash.threadHash,
        account: `eip155:${address}`,
        limit: 2,
        toDecrypt: false,
        pgpPrivateKey: decryptedPvtKey,
        env: ENV.STAGING,
      });

      // actual api
      const decryptedChat = await PushAPI.chat.decryptConversation({
        messages: encryptedChats, // array of message object fetched from chat.history method
        connectedUser: user, // user meta data object fetched from chat.get method
        pgpPrivateKey: decryptedPvtKey, //decrypted private key
        env: ENV.STAGING,
      });

      setDecryptedChats(decryptedChat);
    } catch (error) {
      const err = error as Error;
      alert(err.message);
      return;
    }
  }

  return { decryptChats, decryptedChats };
};

export default useDecryptPushChats;
