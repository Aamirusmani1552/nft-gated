import React from "react";
import * as PushAPI from "@pushprotocol/restapi";
import { useAddress } from "@thirdweb-dev/react";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import useLocalStorage from "./useLocalStorage";
import { getEthereumSigner } from "@/helper";
import { IUser } from "@pushprotocol/restapi";

const usePushUser = () => {
  const address = useAddress();
  const { setLocalStorage } = useLocalStorage();
  let newUser: any;
  let user: IUser | undefined;

  async function pushUser() {
    try {
      if (!address) {
        alert("Connect to wallet first");
        return;
      }

      // getting signer
      const signer = await getEthereumSigner();

      if (!signer) {
        alert("signer not available");
        return;
      }

      console.log(signer);

      // getting the user encrypted keys if exists already
      user = await PushAPI.user.get({
        account: `eip155:${address}`,
        env: ENV.STAGING,
      });

      console.log(user, "is the user");

      if (user.encryptedPrivateKey == "") {
        console.log("no user exists");
        console.log("creating new user...");
        // generating new key if not exist and retreiving it
        newUser = await PushAPI.user.create({
          signer: signer,
          env: ENV.STAGING,
          account: address,
        });

        user = await PushAPI.user.get({
          account: `eip155:${address}`,
          env: ENV.STAGING,
        });
      }
      const decryptedPvtKey = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: user.encryptedPrivateKey,
        signer,
      });

      // storing the key in localStorage
      await setLocalStorage("push_user", JSON.stringify(user));
      await setLocalStorage(
        "push_user_private",
        JSON.stringify(decryptedPvtKey)
      );
      console.log(user);
    } catch (error) {
      let err = error as Error;
      alert(err.message);
    }
  }

  return { pushUser };
};

export default usePushUser;
