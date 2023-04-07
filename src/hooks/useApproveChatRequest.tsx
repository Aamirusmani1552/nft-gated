import { getEthereumSigner } from "@/helper";
import { useAddress } from "@thirdweb-dev/react";
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { toast } from "react-hot-toast";

const useApproveChateRequest = () => {
  const address = useAddress();

  async function approveChatRequest(account: string) {
    try {
      if (!address) {
        alert("Connect wallet first");
        return;
      }

      //getting signer
      const signer = await getEthereumSigner();

      const response = await PushAPI.chat.approve({
        status: "Approved",
        account: address,
        senderAddress: account, // receiver's address or chatId of a group
        env: ENV.STAGING,
        signer: signer,
      });

      toast.success("Approved, please refresh or come back later");
    } catch (error) {
      const err = error as Error;
      toast.error(err.name);
      return;
    }
  }

  return { approveChatRequest };
};

export default useApproveChateRequest;
