import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const totalChatsAtom = atomWithStorage("totalChatsAtom", []);
export const showSideBarAtom = atom(false);
export const isVideoMaximizedAtom = atom(true);
export const isWebSocketConnectedAtom = atom(null);
export const lastVideoUrlAtom = atom("/placeholder.mp4");
export const fontValueAtom = atom(18);
export const activeAnimationAtom = atom("breath")
