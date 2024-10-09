/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Image from "next/image";
import { useState } from "react";

export default function Toggle({ hasPicture, onChange }) {
  const [active, setActive] = useState(true);

  const toggleGender = () => {
    setActive((v) => {
      const newValue = !v;
      onChange(newValue);
      return newValue;
    });
  };

  return (
    <button
      className="flex items-center justify-end w-[44px]"
      onClick={toggleGender}
    >
      <div className="flex items-center ">
        <div
          className={`w-11 h-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] flex items-center text-green-500 rounded-full p-1 cursor-pointer  ${
            hasPicture
              ? "bg-[#54C5D0]"
              : active
              ? "bg-[#54C5D0]"
              : "bg-[#D2DEDE]"
          }`}
        >
          <div
            className={`bg-white w-[17px] h-[17px] rounded-full shadow-md transform transition-transform flex items-center justify-center ${
              active ? "translate-x-0" : "translate-x-[-18px]"
            }`}
          >
            {!!hasPicture &&
              (active ? (
                <Image
                  height={13}
                  width={13}
                  alt="mard"
                  src="/images/male-users-.png"
                />
              ) : (
                <Image
                  height={13}
                  width={13}
                  alt="zan"
                  src="/images/female-users-.png"
                />
              ))}
          </div>
        </div>
      </div>
    </button>
  );
}
