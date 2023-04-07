import { IMessageIPFS } from "@pushprotocol/restapi";
import Image from "next/image";
import React, { FC, ReactElement, useEffect } from "react";
import previewImage from "../../public/image.png";
import axios from "axios";
import fileDownload from "js-file-download";
import { AiOutlineCloudDownload } from "react-icons/ai";

type MessageTypes = "Text" | "Image" | "File" | "GIF" | "MediaURL";

type Props = {
  sentByMe: boolean;
  message: string;
  messageType: IMessageIPFS["messageType"];
};

const ChatTextMessage: FC<Props> = ({
  sentByMe = true,
  message = "",
  messageType,
}): ReactElement => {
  const download = (url: string) => {
    console.log("i am running");
    axios({
      url: url,
      responseType: "blob",
      method: "GET",
    })
      .then((data) => {
        const type = data.data.type;
        console.log(type);
        const fileName = type.startsWith("image/")
          ? "Download.png"
          : type.startsWith("video/")
          ? "Vedio.mp4"
          : type.startsWith("audio/")
          ? "Audio.mpeg"
          : type.startsWith("application/pdf")
          ? "File.pdf"
          : type.startsWith("application/json")
          ? "File.json"
          : type.startsWith(
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
          ? "Download.docx"
          : "File";
        fileDownload(data.data, fileName);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className={
        !sentByMe
          ? "bg-background  rounded-lg max-w-[250px] md:max-w-[400px] text-gray-700 text-sm self-start rounded-tl-none w-fit p-4"
          : "bg-primaryPurple text-white text-sm max-w-[250px] md:max-w-[400px] rounded-lg self-end rounded-tr-none w-fit p-4"
      }
    >
      {(messageType == "Image" || messageType == "File") && (
        <p className=" flex items-center justify-end w-full">
          <span
            className="cursor-pointer text-xl font-bold"
            onClick={() => {
              download(
                message.replace(
                  "ipfs://",
                  "https://alchemy.mypinata.cloud/ipfs/"
                )
              );
            }}
          >
            <AiOutlineCloudDownload />{" "}
            {messageType == "File" && (
              <span className="text-xs font-normal">
                Click to download the file
              </span>
            )}
          </span>
        </p>
      )}
      {messageType == "Text" ? (
        <p>{message}</p>
      ) : (
        messageType == "Image" && (
          <div className="w-[150px] md:w-[250px] h-[150px] md:h-[250px] relative">
            <Image
              src={
                message
                  ? message.replace(
                      "ipfs://",
                      "https://alchemy.mypinata.cloud/ipfs/"
                    )
                  : previewImage.src
              }
              alt={message.slice(0, 10) + "chatSynergy"}
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ChatTextMessage;
