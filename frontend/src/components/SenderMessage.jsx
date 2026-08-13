import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

function SenderMessage({
  image,
  message,
  messageId,
  selectMode,
  selected,
  onSelect,
}) {
  const scroll = useRef();
  const { userData } = useSelector((state) => state.user);

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
    <div
      className="w-full flex items-end justify-end gap-[10px] cursor-pointer"
      onClick={() => selectMode && onSelect(messageId)}
    >
      <div
        ref={scroll}
        className={`w-fit max-w-[500px] px-[20px] py-[10px] bg-[#2d80ed] text-white text-[17px] rounded-2xl rounded-tr-none relative shadow-md gap-[10px] flex flex-col break-words ${
          selected ? "ring-4 ring-blue-300" : ""
        }`}
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

      <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-md shrink-0 border-2 border-white">
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