/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  isVideoMaximizedAtom,
  showSideBarAtom,
  totalChatsAtom,
  isWebSocketConnectedAtom,
  lastVideoUrlAtom,
} from "@/src/jotai/atoms";
import { useAtom } from "jotai";
import SideBar from "../components/SideBar";
import ChatBox from "../components/ChatBox";
import SuggestCard from "../components/SuggestCard";
import MainInput from "../components/MainInput";
import AiPlayer from "../components/AiPlayer/2";
import { io } from "socket.io-client";
import { getCookie, setCookie } from "cookies-next";
import AiModel from "../components/AiPlayer/index";

const cardsData = [
  {
    icon: "/images/NotePencil.png",
    text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم",
    href: "/?isVoice=true",
  },
  {
    icon: "/images/NotePencil.png",
    text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از",
    href: "/?isVoice=true",
  },
  {
    icon: "/images/NotePencil.png",
    text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از",
    href: "/?isVoice=true",
  },
  {
    icon: "/images/NotePencil.png",
    text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از",
    href: "/?isVoice=true",
  },
];

const headerHeight = "81px";
const HomePage = () => {
  const searchParams = useSearchParams();
  const isVoiceQuery = searchParams.get("isVoice") === "true";
  const isVideoQuery = searchParams.get("isVideo") === "true";
  const chatIdParam = searchParams.get("chatId");
  const [totalChats, setTotalChats] = useAtom(totalChatsAtom);
  const [showSideBar, setShowSideBar] = useAtom(showSideBarAtom);
  const [isVideoMaximized, setIsVideoMaximized] = useAtom(isVideoMaximizedAtom);
  const [isWebSocketConnected, setIsWebSocketConnected] = useAtom(
    isWebSocketConnectedAtom
  );

  const chatListEl = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://192.168.103.32:3000/chat");
    socket.on("connect", () => {
      socketRef.current = socket;

      setIsWebSocketConnected(socket);

      const authToken = getCookie("token");

      if (authToken) {
        socket.emit("authorize", { token: authToken });
      } else {
        socket.emit("register", {}, (registerRes) => {
          const resToken = registerRes.data.userToken;

          socket.emit("authorize", { token: resToken }, (authStatus) => {
            if (authStatus?.status === "ok") {
              setCookie("token", resToken);
            }
          });
        });
      }
    });
  }, []);

  const conversation = totalChats?.find?.((chat) => chat.id === chatIdParam);

  const textSubmited = () => {
    chatListEl.current?.scrollBy({
      top: 10_000,
      behavior: "smooth",
    });

    setTimeout(() => {
      chatListEl.current?.scrollBy({
        top: 10_000,
        behavior: "smooth",
      });
    }, 20);
  };

  const updateStreamScrolling = () => {
    textSubmited();
  };



  return (
    <div className="flex items-stretch parent-all">
      <SideBar />
      <div
        className={` ${
          showSideBar ? "md:w-full md:px-full w-0 " : "w-full"
        } flex flex-col justify-between  overflow-hidden h-dvh content-wrapper `}
      >
        <div
          className={`${
            showSideBar ? "pr-[10px]" : "pr-[70px]"
          } pl-[10px] pb-[16px] pt-[40px] w-full border-b border-[#D3D3D3] flex items-center justify-between`}
          style={{ transition: "0.3s all" }}
        >
          <div>چت‌بات همراه</div>
          <div>نسخه 1.00</div>
        </div>

        <div
          className="flex items-stretch justify-center h-full px-3 pt-3 final-boxx"
          style={{ maxHeight: `calc(100vh - ${headerHeight})` }}
        >
          <div
            className={`${
              isVideoQuery
                ? isVideoMaximized
                  ? "w-0 px-0"
                  : "w-full px-3"
                : "w-full px-3"
            } flex flex-col items-center justify-between pb-[2%] overflow-x-hidden`}
            style={{ transition: "0.3s all" }}
          >
            {totalChats && conversation && chatIdParam ? (
              <div
                ref={chatListEl}
                className="px-2 block mt-auto overflow-y-auto max-w-[850px] w-[100%]"
                style={{ scrollbarGutter: "stable" }}
              >
                <div
                  style={{ overflowAnchor: "auto" }}
                  className="flex flex-col-reverse items-start justify-end w-[100%] gap-[32px] pb-[55px] "
                >
                  {[...conversation.chats].reverse()?.map((chat, index) => (
                    <ChatBox info={chat} key={index} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="bp-4">
                  {!isVideoQuery && (
                    <>
                      <Image
                        src="/images/Logo.png"
                        height={160}
                        width={160}
                        alt="logo"
                        className="mx-auto mb-14 pt-[7%]"
                      />

                      <div className="text-base text-[#292F52] mb-[51px] max-w-[642px] mx-auto">
                        همیار بات، یک دستیار هوشمند و کارآمد برای پاسخگویی به
                        نیازهای مشتریان است. همیار بات با استفاده از فناوری‌های
                        پیشرفته هوش مصنوعی، توانایی ارائه خدمات متنوع از جمله
                        پاسخ به سوالات عمومی، راهنمایی در خصوص محصولات و خدمات،
                        پیگیری مشکلات و پشتیبانی فنی را دارد
                      </div>
                    </>
                  )}

                  {!isVoiceQuery && !isVideoQuery && (
                    <div className="flex items-center justify-between gap-6 max-w-[585px] mx-auto">
                      <Link
                        href="/?isVideo=true"
                        className="flex items-center justify-center w-full min-w-fit bg-[#48C4CB] text-white rounded-lg text-center h-[46px]"
                      >
                        شروع گفت‌وگو تصویری
                      </Link>
                      <Link
                        href="/?isVoice=true"
                        className="flex items-center justify-center  w-full min-w-fit text-[#FF8C00] border border-[#FF8C00] rounded-lg text-center h-[46px]"
                      >
                        شروع گفت‌وگو صوتی
                      </Link>
                    </div>
                  )}
                </div>

                {isVoiceQuery && (
                  <div className="flex items-center justify-between gap-4 max-w-[850px] w-full overflow-x-auto py-1">
                    {cardsData.map((card, index) => (
                      <SuggestCard card={card} key={index} />
                    ))}
                  </div>
                )}
              </>
            )}

            {!!socketRef?.current && (
              <MainInput
                ref={socketRef}
                textSubmited={textSubmited}
                updateStreamScrolling={updateStreamScrolling}
              />
            )}
          </div>
          {/* {!!socketRef?.current && (
            <AiPlayer
              ref={socketRef}
              updateStreamScrolling={updateStreamScrolling}
            />
          )} */}
          <div>
            {!!socketRef?.current && (
              <AiModel
                ref={socketRef}
                updateStreamScrolling={updateStreamScrolling}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
