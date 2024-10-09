import Image from "next/image";
import React, { useState } from "react";
import Toggle from "../Toggle/Toggle";
import { useAtom } from "jotai";
import {
  fontValueAtom,
  showSideBarAtom,
  totalChatsAtom,
} from "@/src/jotai/atoms";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import LinkedToggle from "../Toggle/LinkedToggle";
import styles from "./styles.module.css";

const SideBar = () => {
  const [totalChats, setTotalChats] = useAtom(totalChatsAtom);
  const [showSideBar, setShowSideBar] = useAtom(showSideBarAtom);
  const [fontValue, setFontValue] = useAtom(fontValueAtom);

  const [blur, setBlur] = useState(!showSideBar);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isVideoQuery = searchParams.get("isVideo");

  const handleUrl = (id) => {
    const params = new URLSearchParams(searchParams);
    params.set("chatId", id);

    return `${pathname}?${params.toString()}`;
  };

  const onGenderChange = () => {};
  const togglePlayer = () => {};

  const onChangeValue = (e) => {
    setFontValue(e.target.value);
  };

  const onSideBarCLicked = () => {
    setShowSideBar((v) => {
      setTimeout(
        () => {
          setBlur(v);
        },
        v ? 0 : 50
      );

      return !v;
    });
  };

  return (
    <>
      <button
        className="absolute z-[51] right-[33px] top-[42px]"
        onClick={onSideBarCLicked}
      >
        <Image height={25} width={25} src="/images/hamber.png" alt="hamber" />
      </button>
      <div
        style={{ transition: "0.5s all" }}
        className={`${
          showSideBar
            ? "flex-grow-1 pr-8 pl-2 w-full"
            : "flex-grow-0 pr-0 pl-0 w-0"
        } bg-[#F9F9F9] h-dvh max-h-dvh pt-[65px] text-[#292F52] overflow-hidden relative flex flex-col md:max-w-[300px]`}
      >
        <div
          className={`absolute inset-0 z-50 pointer-events-none ${
            blur ? "opacity-100" : "opacity-0"
          } `}
          style={{ backdropFilter: "blur(20px)", transition: "0.3s all " }}
        />

        <div className="flex flex-col gap-[32px] mt-[70px]">
          <div>
            <div className="text-[14px] mb-1">انتخاب شخصیت</div>
            <Toggle hasPicture onChange={onGenderChange} />
          </div>
          <div>
            <div className="text-[14px] mb-1">گفت‌وگوی تصویری</div>
            <LinkedToggle />
          </div>

          <div>
            <div className="text-[14px] mb-1">حالت شب</div>
            <Toggle onChange={onGenderChange} />
          </div>
        </div>
        <div>
          <div>
            <div className="text-[14px] mt-4 mb-[8px] text-[#292F52]">
              اندازه فونت
            </div>
            <label className="text-[16px] mb-1 mr-1">A</label>
            <input
              type="range"
              min="15"
              max="30"
              step="3"
              value={fontValue}
              onChange={onChangeValue}
              className={styles.rangeInput}
            />
            <label className="text-[20px] mb-1 ml-1 text-[#292F52] ">A</label>
          </div>
        </div>

        <div className="h-px w-2/3 bg-[#D5D7E3] mx-auto mt-7 mb-4 rounded-md" />
        <div className="font-medium text-[#16013C] mb-5">
          تاریخچه گفت‌وگوهای اخیر
        </div>
        <div className="text-[#292F52] overflow-y-auto pb-10">
          {totalChats.map((item, index) => (
            <Link href={handleUrl(item.id)} key={index}>
              <div className="mt-2 flex items-center justify-start gap-2.5 ">
                <Image src="/images/cm.png" height={15} width={15} alt="chat" />
                <div
                  style={{
                    display: "-webkit-box",
                    lineClamp: 1,
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {item.chats?.[0]?.text}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div
          className="absolute bottom-0 w-full left-0 right-0 h-24 z-[500] pointer-events-none "
          style={{
            background: "linear-gradient(#f9f9f911, #f9f9f9)",
          }}
        />
      </div>
    </>
  );
};

export default SideBar;
