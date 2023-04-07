import useSendPushMessage from "@/hooks/useSendPushMessage";
import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import * as PushAPI from "@pushprotocol/restapi";
import useDecryptSingleChat from "@/hooks/useDecryptSingleChat";
import { FiPaperclip } from "react-icons/fi";
import { AiOutlineFile } from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import { useStorageUpload } from "@thirdweb-dev/react";

type Props = {
  receiver: string;
  setChatsHistory: React.Dispatch<React.SetStateAction<PushAPI.IMessageIPFS[]>>;
};

const NewMessageInput: FC<Props> = ({
  receiver,
  setChatsHistory,
}): ReactElement => {
  const { sendPushMessage } = useSendPushMessage();
  const [textMessage, setTextMessage] = useState<string>("");
  const { decryptChat } = useDecryptSingleChat();
  const [isOpenPicker, setIsOpenPicker] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [file, setFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>();
  const { mutateAsync: uploadToIpfs } = useStorageUpload();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSendText() {
    setLoading(true);
    if (textMessage.length > 0 || image || file) {
      let ipfsUrl;
      if (image || file) {
        ipfsUrl = await uploadToIpfs({ data: [image ? image : file] });
      }

      if ((image || file) && ipfsUrl && ipfsUrl?.length == 0) {
        alert("cannot upload to ipfs");
        return;
      }

      let urlToSend = ipfsUrl ? ipfsUrl[0] : "";

      let newMessage = await sendPushMessage({
        message: urlToSend.length > 0 ? urlToSend : textMessage,
        receiverAddress: receiver.replace("eip155:", ""),
        messageType: image ? "Image" : file ? "File" : "Text",
      });

      console.log("now here");

      const decryptedMessage = await decryptChat(newMessage);
      if (decryptedMessage) {
        setChatsHistory((prev) => [decryptedMessage, ...prev]);
        image
          ? setImage(undefined)
          : file
          ? setFile(undefined)
          : console.log("successfully send");
      } else {
        alert("an error occured");
      }

      setTextMessage("");
      setLoading(false);
    }
  }

  async function handleChange() {
    if (typeof window != "undefined") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(image!);
    }
  }

  useEffect(() => {
    if (image) {
      handleChange();
    }
  }, [image]);

  return (
    <div className="flex gap-2 items-center relative">
      <label
        htmlFor="new-message"
        className="bg-background px-4 py-4 rounded-full text-sm text-gray-700 flex-1 flex relative"
      >
        {image && (
          <div className="rounded-md absolute top-[-250px] border-[1px] w-full flex flex-col items-center justify-center bg-[#F4F7FA]  p-2">
            <div className="flex items-center justify-end w-full">
              <span
                className="cursor-pointer text-2xl"
                onClick={() => {
                  if (loading) return;
                  setImage(undefined);
                  setFile(undefined);
                }}
              >
                <RxCross2 />
              </span>
            </div>
            <div className="w-[150px] md:w-[200px] h-[150px] md:h-[200px] overflow-hidden relative">
              <Image
                className="absolute"
                src={imagePreview!}
                alt="preview_image"
                fill
                style={{ objectFit: "contain" }}
              />
              {loading && (
                <div className="w-full h-full backdrop-blur-sm absolute top-0 left-0 flex flex-col gap-2 items-center justify-center">
                  <div className="w-8 h-8 border-4 border-b-transparent border-gray-500 animate-spin rounded-full"></div>
                  <span>Sending</span>
                </div>
              )}
            </div>
          </div>
        )}
        {!image && !file ? (
          <input
            type="text"
            name="new-message"
            id="new-message"
            className="bg-background disabled:opacity-70 outline-none border-none placeholder:text-gray-500 flex-1"
            placeholder="type a message"
            value={textMessage}
            disabled={loading}
            onChange={(e) => {
              setTextMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleSendText();
              }
            }}
          />
        ) : (
          <div className="flex-1 text-gray-500 flex items-center gap-4">
            <span>selected: {image ? image.name : file ? file.name : ""}</span>
            <span
              className="cursor-pointer text-xl"
              onClick={() => {
                if (loading) return;
                setImage(undefined);
                setFile(undefined);
              }}
            >
              <RxCross2 />
            </span>
            {loading && (
              <div className="w-full h-full backdrop-blur-sm absolute top-0 left-0 flex items-center justify-center">
                <span>Sending...</span>
              </div>
            )}
          </div>
        )}

        {!image && !file && (
          <span
            className="text-xl text-gray-500 pr-2 cursor-pointer relative"
            onClick={(e) => {
              e.stopPropagation();
              if (loading) return;
              setIsOpenPicker((prev) => !prev);
            }}
          >
            <FiPaperclip />
          </span>
        )}
      </label>

      {/* picker */}

      {isOpenPicker && (
        <motion.div
          className="absolute  border-[1px] origin-bottom-right text-sm bg-white top-[-100px] right-[94px] rounded-md flex flex-col"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="flex gap-2 w-full items-center px-8 py-4 border-b-[1px] border-gray-200  cursor-pointer hover:bg-gray-100">
            <label htmlFor="message_file" className="flex gap-2">
              <input
                type="file"
                name="message_file"
                id="message_file"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                    setIsOpenPicker(false);
                  }
                }}
                accept="video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
              />
              <AiOutlineFile />
              <span>File</span>
            </label>
          </div>
          <div className="flex w-full gap-2 items-center px-4 py-4 cursor-pointer hover:bg-gray-100">
            <label htmlFor="message_image" className="flex gap-2">
              <input
                type="file"
                name="message_image"
                id="message_image"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                    setIsOpenPicker(false);
                  }
                }}
                accept="image/png, image/jpeg, image/gif, image/*"
                className="hidden"
              />
              <BiImage />
              <span>Image</span>
            </label>
          </div>
        </motion.div>
      )}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => {
          if (loading) return;
          handleSendText();
        }}
        className="text-white outline-none disabled:opacity-75 bg-primarySky w-12 h-12 flex items-center justify-center rounded-full"
      >
        <IoSend />
      </motion.button>
    </div>
  );
};

export default NewMessageInput;
