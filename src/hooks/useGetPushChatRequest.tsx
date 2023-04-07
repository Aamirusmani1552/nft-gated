import { getEthereumSigner } from "@/helper";
import { IFeeds, IUser } from "@pushprotocol/restapi";
import { useAddress } from "@thirdweb-dev/react";
import * as PushAPI from "@pushprotocol/restapi";
import useLocalStorage from "./useLocalStorage";
import usePushUser from "./usePushUser";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { useState } from "react";
import { toast } from "react-hot-toast";

const useGetPushChatRequest = () => {
  const address = useAddress();
  const { getLocalStorage } = useLocalStorage();
  const { pushUser } = usePushUser();
  const [chatRequests, setChatRequests] = useState<IFeeds[]>();

  async function getPushChatRequests() {
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

      //   // getting decrypted key
      const decryptedPvtKey = JSON.parse(
        await getLocalStorage("push_user_private")
      );

      const chatReq = await PushAPI.chat.requests({
        account: `eip155:${address}`,
        toDecrypt: true,
        pgpPrivateKey: decryptedPvtKey,
        env: ENV.STAGING,
      });

      setChatRequests(chatReq);
    } catch (error) {
      const err = error as Error;
      toast.error(err.name);
      return;
    }
  }

  return { getPushChatRequests, chatRequests };
};

export default useGetPushChatRequest;
