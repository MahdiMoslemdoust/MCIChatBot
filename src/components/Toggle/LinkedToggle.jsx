"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function LinkedToggle({ hasPicture }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isActive = searchParams.get("isVideo") === "true";

  const handleUrl = () => {
    const isActive = searchParams.get("isVideo") === "true";
    const params = new URLSearchParams(searchParams);
    params.set("isVideo", !isActive);

    return `${pathname}?${params.toString()}`;
  };

  return (
    <Link
      href={handleUrl()}
      className="flex items-center justify-end w-[44px]"
      replace
      scroll={false}
    >
      <div className="flex items-center ">
        <div
          className={`w-11 h-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] flex items-center text-green-500 rounded-full p-1 cursor-pointer  ${
            isActive ? "bg-[#54C5D0]" : "bg-[#D2DEDE]"
          }`}
        >
          <div
            className={`bg-white w-[17px] h-[17px] rounded-full shadow-md transform transition-transform flex items-center justify-center ${
              isActive ? "translate-x-0" : "translate-x-[-18px]"
            }`}
          />
        </div>
      </div>
    </Link>
  );
}
