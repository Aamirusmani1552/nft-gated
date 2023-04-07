import { getEthereumSigner } from "@/helper";
import { useAddress } from "@thirdweb-dev/react";
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import useLocalStorage from "./useLocalStorage";
import usePushUser from "./usePushUser";
import { IMessageIPFS, IUser } from "@pushprotocol/restapi";

const useDecryptSingleChat = () => {
  const address = useAddress();
  const { getLocalStorage } = useLocalStorage();
  const { pushUser } = usePushUser();

  async function decryptChat(chatToDecrypt: IMessageIPFS) {
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

      // actual api
      const decryptedChat = await PushAPI.chat.decryptConversation({
        messages: [chatToDecrypt], // array of message object fetched from chat.history method
        connectedUser: user, // user meta data object fetched from chat.get method
        pgpPrivateKey: decryptedPvtKey, //decrypted private key
        env: ENV.STAGING,
      });

      return decryptedChat[0];
    } catch (error) {
      const err = error as Error;
      alert(err.message);
      return;
    }
  }

  return { decryptChat };
};

export default useDecryptSingleChat;
