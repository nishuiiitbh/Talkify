import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

function ReceiverMessage({
  image,
  message,
  messageId,
  selectMode,
  selected,
  onSelect,
}) {
  const scroll = useRef();
  const { selectedUser } = useSelector((state) => state.user);

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
      className="w-full flex items-end gap-[10px] cursor-pointer"
      onClick={() => selectMode && onSelect(messageId)}
    >
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-md shrink-0 border-2 border-white">
        <img
          src={selectedUser?.image || dp}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div
        ref={scroll}
        className={`w-fit max-w-[500px] px-[20px] py-[10px] bg-white text-[#1F2937] text-[17px] rounded-2xl rounded-tl-none relative shadow-md border border-[#E2E8F0] gap-[10px] flex flex-col break-words ${
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
    </div>
  );
}

export default ReceiverMessage;