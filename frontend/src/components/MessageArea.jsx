import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import startConversation from "../assets/startConversation.png";
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
        <div className="w-full h-full flex justify-center items-center bg-[#f4f7fb] overflow-hidden p-[15px]">
          <img
            src={startConversation}
            alt="Start Conversation"
            className="w-full h-full max-w-[1000px] max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MessageArea;