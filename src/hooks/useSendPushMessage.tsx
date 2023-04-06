import { ChatSendOptionsType, IUser } from "@pushprotocol/restapi";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import React from "react";
import useLocalStorage from "./useLocalStorage";
import usePushUser from "./usePushUser";
import * as PushAPI from "@pushprotocol/restapi";
import { getEthereumSigner } from "@/helper";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";

interface SendMessageParams {
  message: string;
  messageType?: "Text" | "Image" | "File" | "GIF" | "MediaURL";
  receiverAddress: string;
}

const useSendPushMessage = () => {
  const address = useAddress();
  const { getLocalStorage } = useLocalStorage();
  const { pushUser } = usePushUser();

  async function sendPushMessage({
    message = "",
    messageType = "Text",
    receiverAddress,
  }: SendMessageParams) {
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
        console.log("pushing user");
        user = (await JSON.parse(await getLocalStorage("push_user"))) as IUser;
      }

      //   // getting decrypted key
      const decryptedPvtKey = await JSON.parse(
        await getLocalStorage("push_user_private")
      );

      console.log();

      const response = await PushAPI.chat.send({
        messageContent: message,
        messageType: messageType,
        receiverAddress: `eip155:${receiverAddress}`,
        signer,
        pgpPrivateKey: decryptedPvtKey,
        env: ENV.STAGING,
        account: `eip155:${address}`,
      });

      console.log(response);
    } catch (error) {
      console.log(error);
      const err = error as Error;
      alert(err.message);
      return;
    }
  }
  return { sendPushMessage };
};

export default useSendPushMessage;
