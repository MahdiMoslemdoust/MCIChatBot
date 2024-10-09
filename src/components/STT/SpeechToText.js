import React, { useState, useEffect } from "react";
import { MdMicNone } from "react-icons/md";

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "Your browser does not support speech recognition. Please use Chrome."
      );
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fa-IR";

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + event.results[i][0].transcript);
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(interim);
      console.log(interimTranscript);
    };

    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [interimTranscript, isRecording]);

  const handleMouseDown = () => {
    setIsRecording(true);
  };

  const handleMouseUp = () => {
    setIsRecording(false);
    if (transcript === "") {
      return;
    } else {
      handleKeyDown();
    }
  };

  const handleKeyDown = () => {
    const chatDiv = document.getElementById("chat");

    const newDiv = document.createElement("div");
    newDiv.classList.add(
      "h-auto",
      "shrink-0",
      "flex",
      "bg-[#54C5D0]",
      "cursor-pointer",
      "text-xl",
      "mb-[2vh]",
      "ml-4",
      "mr-auto",
      "rounded-l-2xl",
      "rounded-b-2xl",
      "pt-[1vh]",
      "pb-[1vh]",
      "pr-[5vw]",
      "pl-[5vw]",
      "max-w-[80vw]"
    );
    newDiv.setAttribute("dir", "rtl");
    newDiv.innerHTML = transcript;
    chatDiv.appendChild(newDiv);

    const newAnswerDiv = document.createElement("div");
    newAnswerDiv.classList.add(
      "h-auto",
      "shrink-0",
      "flex",
      "bg-[#F3F4F6]",
      "cursor-pointer",
      "text-xl",
      "mb-[2vh]",
      "ml-[2vw]",
      "rounded-r-2xl",
      "rounded-b-2xl",
      "pt-[1vh]",
      "pb-[1vh]",
      "pr-[5vw]",
      "pl-[5vw]",
      "max-w-[80vw]"
    );
    newAnswerDiv.setAttribute("dir", "rtl");
    newAnswerDiv.innerHTML =
      "در حال حاضر قادر به پاسخگویی نیستیم لطفا مدتی بعد مجددا مراجعه کنید";

    chatDiv.appendChild(newAnswerDiv);
    window.scrollTo(0, document.body.scrollHeight);
    setTranscript("");
    setInterimTranscript("");
  };

  return (
    <button
      onKeyDown={handleMouseDown}
      onKeyUp={handleMouseUp}
      className="ml-[3vw] mr-[3vw] items-stretch  bg-[#54c5d0] active:outline-none   active:ring-[#54c5d0] rounded-full  active:bg-[#54c6d084]  active:ring active:delay-150  active:ring-offset-4 active:outline-offset-4 w-[12.3vw] h-[12.3vw] "
    >
      <MdMicNone className="mx-auto my-auto size-7" />
    </button>
  );
};

export default SpeechToText;
