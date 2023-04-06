import { NftValidationUtility } from "@whal3s/whal3s.js";
import exampleImage from "../../public/nature.png";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";
import ClaimNFT from "./_claimNft";

type Props = {
  utility: NftValidationUtility;
};

type NftFetchResult = {
  description: string;
  image: string;
  name: string;
  attributes: [];
};

const Step3Whales: React.FC<Props> = ({ utility }): React.ReactElement => {
  const [NFTImage, setNFTImage] = useState<string>();
  const [selected, setSelected] = useState<boolean>(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  console.log(utility, "is the utitlity");

  if (utility.nfts.nfts?.[0].valid == false) {
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

  console.log(NFTImage, "is the image");
  return (
    <div className="text-base font-normal flex flex-col items-center gap-4">
      <h3 className=" text-primaryPurple text-center font-bold text-3xl">
        Your NFTs
      </h3>
      <p className="pb-4">Choose the one to connect with</p>
      {utility.nfts.nfts.map((nft, k) => {
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
      })}
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
