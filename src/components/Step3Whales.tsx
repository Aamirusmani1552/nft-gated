import { NftValidationUtility } from "@whal3s/whal3s.js";
import exampleImage from "../../public/nature.png";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";
import ClaimNFT from "./_claimNft";
import Loader from "./Loader";
import { WalletNftValidationResponse } from "@whal3s/whal3s.js/build/types/types/types-internal";

type Props = {
  utility: NftValidationUtility;
  step: number;
};

type NftFetchResult = {
  description: string;
  image: string;
  name: string;
  attributes: [];
};

const Step3Whales: React.FC<Props> = ({
  utility,
  step,
}): React.ReactElement => {
  const [NFTImage, setNFTImage] = useState<string>();
  const [selected, setSelected] = useState<boolean>(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [hasNFT, setHasNFT] = useState<boolean>(false);
  const [NFTs, setNFTs] = useState<WalletNftValidationResponse>();

  console.log(utility.nfts.nfts, "is the utitlity");

  useEffect(() => {
    if (utility.nfts.nfts && utility.nfts.error.length == 0) return;
    let intervalId;
    setHasNFT(true);
    if (
      step == NftValidationUtility.STEP_NFTS_FETCHED &&
      utility.nfts.nfts.length == 0
    ) {
      intervalId = setTimeout(() => {
        setHasNFT(false);
        setNFTs(utility.nfts);
      }, 2000);
    }
  }, [step, hasNFT, utility.nfts.nfts]);

  console.log(hasNFT, utility.nfts.nfts, "is the result");

  if (!utility) {
    return (
      <div className="w-full flex-1 z-10 font-semibold text-4xl md:text-5xl flex flex-col items-center justify-center gap-4 relative">
        <Loader />
      </div>
    );
  }

  console.log(
    utility?.nfts?.error?.map((i) => console.log(i)),
    "is the error"
  );

  if (utility.nfts && utility.nfts.error.length != 0) {
    return <ClaimNFT />;
  }

  async function fetchNFTMetaData(metaDataURL: string) {
    axios
      .get<NftFetchResult>(metaDataURL)
      .then((data) => {
        setNFTImage(
          data.data.image.replace(
            "ipfs://",
            "https://alchemy.mypinata.cloud/ipfs/"
          )
        );
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  }

  console.log(step);

  return (
    <div className="text-base font-normal flex flex-col items-center gap-4">
      <h3 className=" text-primaryPurple text-center font-bold text-3xl">
        Your NFTs
      </h3>
      <p className="pb-4">Choose the one to connect with</p>
      {NFTs ? (
        NFTs.nfts.map((nft, k) => {
          console.log(utility.nfts.nfts);
          fetchNFTMetaData(nft.attributes.tokenUri.gateway);
          return (
            <div
              key={k}
              className={
                selected
                  ? "flex flex-col w-fit  border-2 border-primarySky cursor-pointer p-4 gap-2 text-sm bg-white rounded-lg"
                  : "flex flex-col w-fit  border-2 border-background p-4 cursor-pointer gap-2 text-sm bg-white rounded-lg"
              }
              onClick={() => {
                setSelected((prev) => !prev);
                setSelectedTokenId(nft.attributes.id.tokenId);
              }}
            >
              <div className="relative h-[200px] w-[200px] rounded-md bg-primarySky shadow-md">
                <Image
                  src={NFTImage ? NFTImage : exampleImage}
                  alt="nft_image"
                  fill
                  className="absolute"
                  style={{
                    objectFit: "contain",
                  }}
                ></Image>
              </div>
              <div>{nft.attributes.contractMetadata.name}</div>
              <div>{nft.attributes.description}</div>
            </div>
          );
        })
      ) : (
        <span className="block h-6 w-6 rounded-full border-4 border-gray-500 border-b-transparent animate-spin"></span>
      )}
      {selected && (
        <div>
          <motion.button
            className=" bg-primaryPurple text-white px-4 py-2 font-normal tracking-wider text-lg rounded-md border-none outline-none relative mt-2 flex gap-2 items-center justify-center before:w-full before:h-full before:absolute before:border-2 before:border-primaryPurple before:left-1 before:bg-transparent before:z-0 before:top-1 before:rounded-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (
                selectedTokenId &&
                utility.step != NftValidationUtility.STEP_TOKEN_SELECTED
              )
                utility.tokenId = selectedTokenId;
              utility
                .reserveEngagement()
                .then((data) => {
                  console.log(data);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <span>Next Step</span>
            <BsArrowRight />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Step3Whales;
