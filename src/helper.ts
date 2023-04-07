import { ethers } from "ethers";

export async function getEthereumSigner() {
  if (typeof window != undefined) {
    try {
      if (!window.ethereum) {
        throw new Error("Please install metamask");
      }

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      // try {
      //   let
      //   // Request access to user's Metamask account
      //   await window.ethereum({ method: "eth_requestAccounts" });
      // } catch (error) {
      //   // Handle error
      //   console.error(error);
      // }

      // Create signer object with user's Ethereum account
      const signer = provider.getSigner();
      return signer;
    } catch (error) {
      throw error;
    }
  }
}

export function isDateMoreThanDayOld(date: Date): boolean {
  // Get the current time in milliseconds
  const now = new Date().getTime();

  // Calculate the difference between the current time and the given date in milliseconds
  const diffInMilliseconds = now - new Date(date).getTime();

  // Calculate the difference in hours
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

  // Return true if the difference in hours is greater than 4, false otherwise
  return diffInDays > 1;
}

export const initializeWhales = async () => {
  const Whal3s = (await import("@whal3s/whal3s.js")).default;
  const { NftValidationUtility } = await import("@whal3s/whal3s.js");
  const Whal3sClient = new Whal3s();
  const utility = await Whal3sClient.createValidationUtility(
    "805ce22c-c3bf-42d0-8e33-2db151302b5c"
  );

  utility.addEventListener("stepChanged", () => {
    console.log("step changed to", utility.step);
  });
  console.log(utility.step);

  return utility;
};
