import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnectV1,
  walletConnect,
  safeWallet,
} from "@thirdweb-dev/react";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    (window as any)?.ethereum?.on("accountsChanged", function () {
      // Time to reload your interface with accounts[0]!
      location.reload();
    });
  }, []);
  return (
    <ThirdwebProvider
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        walletConnectV1(),
        safeWallet(),
      ]}
      activeChain="mumbai"
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
