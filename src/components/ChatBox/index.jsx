import React from "react";

import styles from "./styles.module.css";
import { fontValueAtom } from "@/src/jotai/atoms";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRef } from "react";

const ChatBox = ({ info }) => {
  const { text, sender } = info;
  const textRef = useRef(null);
  const [fontValue] = useAtom(fontValueAtom);

  const handleCopy = () => {
    if (textRef.current) {
      const textToCopy = textRef.current.innerText;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert("متن کپی شد: ");
        })
        .catch((err) => {
          console.error("خطا در کپی کردن متن:", err);
        });
    }
  };

  return (
    <>
      {sender === "user" && (
        <div
          className={`bg-[#48C4CB] text-white rounded-l-lg ml-auto
          mt-2 w-fit px-[24px] py-2.5 rounded-b-lg max-w-[80%] shadow-[0px_2px_2px_0px_#00000040]`}
          style={{ fontSize: `${fontValue}px` }}
        >
          {text}
        </div>
      )}
      {sender === "bot" && (
        <div
          className="self-end bg-[#F3F4F6] text-[#292F52] rounded-r-lg mr-auto
          mt-2 w-fit px-[24px] py-2.5 rounded-b-lg max-w-[80%] shadow-[0px_2px_2px_0px_#00000040]"
          style={{ fontSize: `${fontValue}px` }}
        >
          {text === "loading" ? (
            <div
              style={{ transform: "scale(0.4) translate(-35px, -5px)" }}
              className={styles["lds-ellipsis"]}
            >
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <div>
              <p ref={textRef}>{text}</p>
              <div dir="ltr" className="flex mr-0 gap-[18.69px] mt-3">
                <Image
                  src="/images/like butt.png"
                  width={15.47}
                  height={15.77}
                  alt="likeBtn"
                  className=" cursor-pointer"
                />
                <Image
                  src="/images/Dislikebutt.png"
                  width={15.47}
                  height={15.77}
                  alt="DislikeBtn"
                  className=" cursor-pointer"
                />
                <Image
                  src="/images/Copybutt.png"
                  width={15.47}
                  height={15.77}
                  alt="CopyBtn"
                  className=" cursor-pointer"
                  onClick={handleCopy}
                />
                <Image
                  src="/images/Sperkerbutt.png"
                  width={15.47}
                  height={15.77}
                  alt="SpeakerBtn"
                  className=" cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBox;
