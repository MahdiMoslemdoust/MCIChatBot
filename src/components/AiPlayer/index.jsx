/* eslint-disable react/display-name */
// import { Canvas } from "@react-three/fiber";
// import Experience from "../Experience/Experience";
// import { usePathname, useSearchParams } from "next/navigation";
// import { isVideoMaximizedAtom } from "@/src/jotai/atoms";
// import { useAtom } from "jotai";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";

// function AiModel() {
//   const [isVideoMaximized, setIsVideoMaximized] = useAtom(isVideoMaximizedAtom);
//   const [isRecording, setIsRecording] = useState(false);

//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const isVideoQuery = searchParams.get("isVideo") === "true";

//   console.log(isVideoQuery);

//   return (
//     <>
//       <div className="w-[1312px] h-[738px]  mt-0 relative bg-black ">
//         {/* <Canvas camera={{ position: [0, 0.2, 1] }}>
//           <Experience />
//         </Canvas> */}
//         <div className="w-[487px] h-[136px] bg-[#7B899D4D] blur-4 rounded-[76px] mx-auto border-2 border-white absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center  gap-[72px] justify-center ">
//           <button className=" rounded-full bg-white w-[88px] h-[88px]"></button>
//           <button className=" rounded-full bg-[#FF8C00] w-[88px] h-[88px]"></button>
//           <button className=" rounded-full bg-white w-[88px] h-[88px]"></button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AiModel;

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "../Experience/Experience";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  isVideoMaximizedAtom,
  lastVideoUrlAtom,
  totalChatsAtom,
} from "@/src/jotai/atoms";
import { useAtom } from "jotai";
import Link from "next/link";

const AiModel = forwardRef((props, ref) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoMaximized, setIsVideoMaximized] = useAtom(isVideoMaximizedAtom);
  const [lastVideoUrl, setLastVideoUrl] = useAtom(lastVideoUrlAtom);
  const [inputValue, setInputValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [totalChats, setTotalChats] = useAtom(totalChatsAtom);
  console.log(ref);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVideoQuery = searchParams.get("isVideo") === "true";
  // const isVideoQuery = true;
  const router = useRouter();
  const chatIdParam = searchParams.get("chatId");

  const lastuuidRef = useRef(null);
  const sttText = useRef("");
  const recognition = useRef(null);

  const handleUrl = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("isVideo");
    return `${pathname}?${params.toString()}`;
  };

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const onSizeChanged = () => {
    setIsVideoMaximized((v) => !v);
  };

  useEffect(() => {
    lastuuidRef.current = chatIdParam;
  }, [searchParams, pathname, chatIdParam, router]);

  const onUpdate = (sttValue) => {
    if (!sttValue || sttValue.length === 0) {
      return;
    }

    sttText.current = sttValue;

    if (lastuuidRef.current || chatIdParam) {
      setTotalChats((prevChats) => {
        const chatsCopy = deepCopy(prevChats);

        const selectedConversation = chatsCopy?.find(
          (chat) => chat.id === (chatIdParam || lastuuidRef.current)
        );

        if (
          selectedConversation?.chats &&
          selectedConversation.chats.at(-1).sender === "user"
        ) {
          selectedConversation.chats.at(-1).text = sttValue;
        } else if (selectedConversation?.chats) {
          selectedConversation.chats.push({ sender: "user", text: sttValue });
        }

        return chatsCopy;
      });
    } else {
      ref?.current?.emit("startConversation", {}, (data) => {
        lastuuidRef.current = data?.data?.conversationId;
        const params = new URLSearchParams(searchParams);
        params.append("chatId", data.data.conversationId);
        const newParams = params.toString();

        router.push(`${pathname}?${newParams}&isVideo=true`);

        setTotalChats((prevChats) => {
          return [
            ...prevChats,
            {
              id: lastuuidRef.current,
              date: Date.now(),
              chats: [{ sender: "user", text: sttValue }],
            },
          ];
        });
      });
    }
  };

  const handleButtonClick = () => {
    if (isRecording) {
      recognition.current.stop();
      setIsRecording(false);
    }
    try {
      if (!chatIdParam) {
        console.log("there is no chatidparam");
        chatIdParam;
      }
      recognition.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  };

  useEffect(() => {
    const speech = window?.SpeechRecognition || window?.webkitSpeechRecognition;

    recognition.current = new speech();

    recognition.current.lang = "fa-IR";
    recognition.current.continuous = true;
    recognition.current.interimResults = true;

    recognition.current.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      onUpdate(transcript);
    };

    recognition.current.onend = () => {
      if (!sttText.current) {
        return;
      }

      if (chatIdParam || lastuuidRef.current) {
        setTotalChats((prevChats) => {
          if (chatIdParam) {
            // lastuuidRef.current = chatIdParam;
          }

          const chatsCopy = deepCopy(prevChats);
          const selectedConversation = chatsCopy?.find((chat) => {
            return chat.id === lastuuidRef.current;
          });

          selectedConversation.chats.push({ sender: "bot", text: "loading" });
          return chatsCopy;
        });

        ref?.current?.emit("sendTextMessage", {
          conversationId: lastuuidRef.current,
          message: sttText.current,
          responseType: "video",
        });
      }

      sttText.current = "";
      setIsDisabled(true);
    };

    const onSendTextMessageRes = (res) => {
      if (res?.video?.url) {
        setLastVideoUrl(res.video.url);
      }

      if (res?.textFinished) {
        setIsDisabled(false);
      }
    };

    isVideoMaximizedAtom &&
      ref?.current?.on("sendTextMessageRes", onSendTextMessageRes);

    return () => {};
  }, []);

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current;
  }, [lastVideoUrl]);

  useEffect(() => {
    if (playerRef.current) {
      return;
    }

    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered");
    videoElement.style.backgroundColor = "#fff";
    videoRef.current?.appendChild(videoElement);

    playerRef.current = videojs(videoElement, {
      autoplay: true,
      sources: [
        {
          src: lastVideoUrl,
          type: "video/mp4",
        },
      ],
    });

    playerRef.current.ready(() => {
      const techElement = playerRef?.current?.tech?.()?.el();
      if (techElement) {
        techElement.style.backgroundColor = "#000";
        techElement.style.borderRadius = "30px";
      }
    });

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoRef]);

  useEffect(() => {
    if (playerRef.current) {
      if (lastVideoUrl && isVideoQuery) {
        playerRef.current.src({ src: lastVideoUrl, type: "video/mp4" });
        playerRef.current.play();
      } else {
        playerRef.current.src({ src: "/placeholder.mp4", type: "video/mp4" });
        playerRef.current.play();
      }
    }
  }, [lastVideoUrl]);
  return (
    <div ref={ref} className="w-[1312px] h-full mt-0 mb-4 relative bg-black">
      <div className="w-[487px] h-[136px] bg-[#7B899D4D] blur-4 rounded-[76px] mx-auto border-2 border-white absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-[72px] justify-center">
        <button
          className="rounded-full bg-white w-[88px] h-[88px] "
          onClick={onSizeChanged}
        ></button>
        <button
          className="rounded-full bg-[#FF8C00] w-[88px] h-[88px]"
          onClick={handleButtonClick}
        ></button>
        <Link href={handleUrl()}>
          <button className="rounded-full bg-white w-[88px] h-[88px]"></button>
        </Link>
      </div>
    </div>
  );
});

export default AiModel;
