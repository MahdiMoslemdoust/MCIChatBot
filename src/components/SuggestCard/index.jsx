import Image from "next/image";
import Link from "next/link";
import React from "react";

const SuggestCard = ({ card }) => {
  const { text, icon, href } = card;
  return (
    <Link
      href={href}
      className="relative min-w-[144px] w-[25%] max-w-[200px] h-[120px] md:h-[unset] md:aspect-square border border-[#EDF0F1] rounded-lg shadow-lg text-center flex items-center justify-center text-wrap p-2"
    >
      <Image
        src={icon}
        alt="ax"
        height={24}
        width={24}
        className="absolute top-2 right-2"
      />

      <div className="flex items-center justify-center max-w-[] h-full text-center text-wrap  text-xs md:text-sm text-[#292F52]">
        {text}
      </div>
    </Link>
  );
};

export default SuggestCard;
