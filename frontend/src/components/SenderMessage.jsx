import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

function SenderMessage({ image, message }) {
  let scroll = useRef();

  let { userData } = useSelector((state) => state.user);

  useEffect(() => {
    scroll?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [message, image]);

  const handleImageScroll = () => {
    scroll?.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full flex items-end gap-[10px]">
      <div
        ref={scroll}
        className="
          w-fit
          max-w-[500px]
          px-[20px]
          py-[10px]
          bg-[#2F80ED]
          text-white
          text-[17px]
          rounded-2xl
          rounded-tr-none
          relative
          ml-auto
          shadow-md
          flex
          flex-col
          gap-[10px]
          break-words
        "
      >
        {image && (
          <img
            src={image}
            alt=""
            className="w-[150px] max-h-[250px] object-cover rounded-lg"
            onLoad={handleImageScroll}
          />
        )}

        {message && <span className="break-words">{message}</span>}
      </div>

      <div
        className="
          w-[40px]
          h-[40px]
          rounded-full
          overflow-hidden
          flex
          justify-center
          items-center
          bg-white
          cursor-pointer
          shadow-md
          shrink-0
          border-2
          border-white
        "
      >
        <img
          src={userData?.image || dp}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default SenderMessage;
