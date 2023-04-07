import Head from "next/head";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import DynamicUtilityComponent from "@/components/DynamicUtility";
import { useAddress } from "@thirdweb-dev/react";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const address = useAddress();
  const [showAccessModal, setShowAccessModal] = useState<boolean>(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`w-screen min-h-screen relative flex flex-col bg-background ${inter.className}`}
      >
        <Header />
        {address ? (
          !hasAccess ? (
            <DynamicUtilityComponent setHasAccess={setHasAccess} />
          ) : (
            <Chat />
          )
        ) : (
          <div className="text-center  text-gray-500 flex items-center justify-center">
            <h3 className="bg-white px-8 py-6 mt-8 w-fit rounded-md border-[1px] shadow-md">
              Please Connect Your Wallet first
            </h3>
          </div>
        )}
        <Toaster />
      </main>
    </>
  );
}
