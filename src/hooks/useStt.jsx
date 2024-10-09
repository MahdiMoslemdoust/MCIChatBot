"use client";

import { useRef } from "react";

export default function useStt(onUpdate) {
  const recognition = useRef(null);

  if (typeof window === "undefined") {
    return;
  }

  const speech = window?.SpeechRecognition || window?.webkitSpeechRecognition;

  recognition.current = new speech();

  if (!recognition?.current) {
    throw new Error("Speech recognition API is not supported");
  }
  recognition.current.lang = "fa-IR";
  recognition.current.continuous = true;
  recognition.current.interimResults = true;

  recognition.current.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    onUpdate(transcript);
    transcript && console.log("STT :", transcript);
  };

  return recognition.current;
}
