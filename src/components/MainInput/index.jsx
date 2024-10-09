/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { lastVideoUrlAtom, totalChatsAtom } from "@/src/jotai/atoms";
import { useAtom } from "jotai";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { forwardRef, useEffect, useRef, useState } from "react";

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

const MainInput = forwardRef(({ textSubmited, updateStreamScrolling }, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [totalChats, setTotalChats] = useAtom(totalChatsAtom);
  const [lastVideoUrl, setLastVideoUrl] = useAtom(lastVideoUrlAtom);

  const lastuuidRef = useRef(null);
  const sttText = useRef("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const chatIdParam = searchParams.get("chatId");
  const isVideoQuery = searchParams.get("isVideo") === "true";

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
        lastuuidRef.current = data.data.conversationId;
        const params = new URLSearchParams(searchParams);
        params.append("chatId", data.data.conversationId);
        const newParams = params.toString();
        router.push(`${pathname}?${newParams}`);

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

    updateStreamScrolling();
  };

  const recognition = useRef(null);

  const handleButtonClick = () => {
    if (isRecording) {
      recognition.current.stop();
    } else {
      recognition.current.start();
    }

    setIsRecording((v) => !v);
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
          responseType: isVideoQuery ? "video" : "audio",
        });
      }

      sttText.current = "";
      setIsDisabled(true);
      updateStreamScrolling();
    };

    const onSendTextMessageRes = (res) => {
      updateStreamScrolling();

      if (res?.text) {
        setTotalChats((v) => {
          const copyTotalChats = [...v];

          const selectedConversation = copyTotalChats.find(
            (item) => item.id === (lastuuidRef.current || chatIdParam)
          );

          if (selectedConversation?.chats?.at(-1)?.text === "loading") {
            selectedConversation.chats.at(-1).text = res?.text;
          } else {
            if (selectedConversation) {
              selectedConversation.chats.at(-1).text += res?.text;
            }
          }

          return copyTotalChats;
        });
      }

      if (res?.video?.url) {
        setLastVideoUrl(res.video.url);
      }

      if (res?.textFinished) {
        setIsDisabled(false);
      }
    };
    if (ref?.current) {
      ref?.current?.on("sendTextMessageRes", onSendTextMessageRes);
    }

    return () => {};
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
  };

  const handleKeyDown = (e) => {
    const code = e.keyCode || e.which;

    if (
      !(e.key === "Enter" || code === 13 || code === 10) ||
      !inputValue ||
      inputValue.length === 0
    ) {
      return;
    }

    setIsDisabled(true);

    if (chatIdParam) {
      setTotalChats((prevChats) => {
        if (chatIdParam) {
          lastuuidRef.current = chatIdParam;
        }

        const chatsCopy = deepCopy(prevChats);

        chatsCopy
          ?.find((chat) => chat.id === chatIdParam)
          .chats.push(
            { sender: "user", text: inputValue },
            { sender: "bot", text: "loading" }
          );
        return chatsCopy;
      });

      ref?.current?.emit("sendTextMessage", {
        conversationId: lastuuidRef.current,
        message: inputValue,
        responseType: isVideoQuery ? "video" : "audio",
      });

      setInputValue(() => {
        return "";
      });
    } else {
      ref?.current?.emit("startConversation", {}, (data) => {
        console.log(data.data.conversationId);
        lastuuidRef.current = data.data.conversationId;
        const params = new URLSearchParams(searchParams);
        params.append("chatId", data.data.conversationId);
        const newParams = params.toString();
        router.push(`${pathname}?${newParams}`);

        setTotalChats((prevChats) => {
          return [
            ...prevChats,
            {
              id: lastuuidRef.current,
              date: Date.now(),
              chats: [
                { sender: "user", text: inputValue },
                { sender: "bot", text: "loading" },
              ],
            },
          ];
        });

        ref?.current?.emit("sendTextMessage", {
          conversationId: data.data.conversationId,
          message: inputValue,
          responseType: isVideoQuery ? "video" : "audio",
        });

        setInputValue(() => {
          return "";
        });
      });
    }

    textSubmited();
  };

  return (
    <div className="mx-auto w-full px-5 flex gap-[45px] items-center justify-center">
      <div className="shadow-lg rounded-[12px] border-2 border-[#48C4CB] overflow-hidden w-full max-w-[850px] h-[64px]">
        <input
          disabled={isDisabled || isRecording}
          type="text"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={inputValue}
          className="w-full h-full rounded-[12px] px-[21px] outline-none "
          style={{ caretColor: "#48C4CB" }}
          placeholder="جهت طرح سوال، از طریق پیام متنی اقدام نمایید."
        />
      </div>
      <button
        disabled={isDisabled}
        onClick={handleButtonClick}
        className={`${
          isRecording ? "bg-[#96D]" : "bg-[#96D4DD]"
        } rounded-full min-w-12 min-h-12 w-12 h-12 items-center justify-center flex `}
      >
        <Image
          src="/images/microphone-2.png"
          width={24}
          height={24}
          alt="mic"
        />
      </button>
    </div>
  );
});

export default MainInput;
