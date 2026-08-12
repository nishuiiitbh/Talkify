import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages, FaRegComments, FaUsers } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import { IoSparklesOutline } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

function MessageArea() {
  let { selectedUser, userData, socket, onlineUsers } = useSelector(
    (state) => state.user
  );

  let dispatch = useDispatch();

  let [showPicker, setShowPicker] = useState(false);
  let [input, setInput] = useState("");
  let [frontendImage, setFrontendImage] = useState(null);
  let [backendImage, setBackendImage] = useState(null);

  let image = useRef();

  let { messages } = useSelector((state) => state.message);

  const handleImage = (e) => {
    let file = e.target.files[0];

    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (input.length === 0 && backendImage == null) {
      return;
    }

    try {
      let formData = new FormData();

      formData.append("message", input);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMessages([...messages, result.data]));

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });

    return () => socket?.off("newMessage");
  }, [messages, socket]);

  return (
    <div
      className={`lg:w-[70%] relative ${
        selectedUser ? "flex" : "hidden"
      } lg:flex w-full h-full bg-[#f4f7fb] border-l-2 border-gray-200 overflow-hidden`}
    >
      {selectedUser && (
        <div className="w-full h-full flex flex-col overflow-hidden items-center relative">
          <div className="w-full h-[85px] bg-[#2d80ed] rounded-b-[25px] shadow-gray-400 shadow-lg gap-[15px] flex items-center px-[15px] z-20">
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoIosArrowRoundBack className="w-[40px] h-[40px] text-white" />
            </div>

            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg">
              <img
                src={selectedUser?.image || dp}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-white font-semibold text-[20px]">
                {selectedUser?.name || "user"}
              </h1>

              <span className="text-white text-[13px]">
                {onlineUsers?.includes(selectedUser?._id)
                  ? "online"
                  : selectedUser?.lastSeen
                  ? `last seen ${new Date(
                      selectedUser.lastSeen
                    ).toLocaleString()}`
                  : "offline"}
              </span>
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col py-[25px] px-[15px] pb-[100px] overflow-y-auto gap-[18px]">
            {showPicker && (
              <div className="absolute bottom-[90px] left-[15px] z-[100]">
                <EmojiPicker
                  width={250}
                  height={350}
                  className="shadow-lg"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            {messages &&
              messages.map((mess, index) =>
                mess.sender == userData._id ? (
                  <SenderMessage
                    key={mess._id || index}
                    image={mess.image}
                    message={mess.message}
                  />
                ) : (
                  <ReceiverMessage
                    key={mess._id || index}
                    image={mess.image}
                    message={mess.message}
                  />
                )
              )}
          </div>

          <div className="absolute bottom-[15px] left-0 w-full flex items-center justify-center px-[10px] z-30">
            {frontendImage && (
              <img
                src={frontendImage}
                alt=""
                className="w-[75px] h-[75px] object-cover absolute bottom-[75px] right-[15%] rounded-lg shadow-gray-400 shadow-lg border-2 border-white"
              />
            )}

            <form
              className="w-full max-w-[700px] h-[58px] bg-[#2d80ed] shadow-gray-400 shadow-lg rounded-full flex items-center gap-[15px] px-[18px] relative"
              onSubmit={handleSendMessage}
            >
              <div
                onClick={() => setShowPicker((prev) => !prev)}
                className="shrink-0"
              >
                <RiEmojiStickerLine className="w-[25px] h-[25px] text-white cursor-pointer" />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={image}
                hidden
                onChange={handleImage}
              />

              <input
                type="text"
                className="w-full h-full px-[5px] outline-none border-0 text-[17px] text-white bg-transparent placeholder-white"
                placeholder="Message"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />

              <div
                onClick={() => image.current.click()}
                className="shrink-0"
              >
                <FaImages className="w-[25px] h-[25px] cursor-pointer text-white" />
              </div>

              {(input.length > 0 || backendImage != null) && (
                <button type="submit" className="shrink-0">
                  <RiSendPlane2Fill className="w-[25px] cursor-pointer h-[25px] text-white" />
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#f4f7fb] px-[20px] py-[30px]">
          <div className="flex items-center justify-center gap-[12px] mb-[25px]">
            <div className="w-[65px] h-[65px] rounded-2xl bg-[#2d80ed] flex items-center justify-center shadow-lg rotate-[-6deg]">
              <FaRegComments className="text-white w-[32px] h-[32px]" />
            </div>

            <div className="w-[50px] h-[50px] rounded-2xl bg-white flex items-center justify-center shadow-md rotate-[8deg]">
              <FaUsers className="text-[#2d80ed] w-[25px] h-[25px]" />
            </div>

            <div className="w-[50px] h-[50px] rounded-2xl bg-white flex items-center justify-center shadow-md rotate-[-5deg]">
              <IoSparklesOutline className="text-[#2d80ed] w-[27px] h-[27px]" />
            </div>
          </div>

          <h1 className="text-[#172b4d] text-[30px] sm:text-[36px] font-bold text-center">
            Your space for conversations.
          </h1>

          <p className="text-gray-500 text-[16px] sm:text-[18px] text-center mt-[10px] max-w-[500px]">
            Select someone from the sidebar to begin chatting.
          </p>

          <div className="flex flex-wrap justify-center gap-[15px] mt-[35px]">
            <div className="bg-white rounded-2xl px-[20px] py-[15px] shadow-md flex items-center gap-[10px]">
              <FaRegComments className="text-[#2d80ed] w-[20px] h-[20px]" />
              <span className="text-gray-700 font-medium">Messages</span>
            </div>

            <div className="bg-white rounded-2xl px-[20px] py-[15px] shadow-md flex items-center gap-[10px]">
              <FaUsers className="text-[#2d80ed] w-[20px] h-[20px]" />
              <span className="text-gray-700 font-medium">Connect</span>
            </div>

            <div className="bg-white rounded-2xl px-[20px] py-[15px] shadow-md flex items-center gap-[10px]">
              <IoSparklesOutline className="text-[#2d80ed] w-[20px] h-[20px]" />
              <span className="text-gray-700 font-medium">Chat</span>
            </div>
          </div>

          <div className="flex items-center gap-[8px] mt-[30px] text-gray-400 text-[14px]">
            <span>✨</span>
            <span>Happy chatting!</span>
            <span>💙</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageArea;