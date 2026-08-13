import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearch, IoSparklesOutline } from "react-icons/io5";
import { MdMoreVert, MdDelete, MdSelectAll } from "react-icons/md";
import { RiEmojiStickerLine, RiSendPlane2Fill } from "react-icons/ri";
import { FaImages, FaRegComments, FaUsers } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

import dp from "../assets/dp.webp";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { setSelectedUser } from "../redux/userSlice";
import { setMessages, deleteMessage } from "../redux/messageSlice";
import { serverUrl } from "../main";

function MessageArea() {
  const dispatch = useDispatch();
  const imageRef = useRef();

  const { selectedUser, userData, socket, onlineUsers } = useSelector(
    (state) => state.user
  );
  const { messages } = useSelector((state) => state.message);

  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() && !backendImage) return;
    if (!selectedUser) return;

    try {
      const formData = new FormData();

      formData.append("message", input);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMessages([...(messages || []), result.data]));

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);

      if (imageRef.current) {
        imageRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${serverUrl}/api/message/delete/${messageId}`, {
        withCredentials: true,
      });

      dispatch(deleteMessage(messageId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (!messages?.length) return;

    setSelectedMessages(
      selectedMessages.length === messages.length
        ? []
        : messages.map((message) => message._id)
    );
  };

  const deleteMessages = async (messageList) => {
    if (!messageList.length) return;

    try {
      await Promise.all(
        messageList.map((message) => handleDeleteMessage(message._id))
      );

      setSelectedMessages([]);
      setSelectMode(false);
      setShowMenu(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSelected = () => {
    const selected = messages?.filter((message) =>
      selectedMessages.includes(message._id)
    );

    deleteMessages(selected || []);
  };

  const handleClearConversation = () => {
    deleteMessages(messages || []);
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedMessages([]);
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  const handleSearch = async (value) => {
    setSearchInput(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);

      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${encodeURIComponent(value)}`,
        { withCredentials: true }
      );

      setSearchResults(
        result.data.filter((user) => user._id !== userData?._id)
      );
    } catch (error) {
      console.log(error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));
    setSearchInput("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (
        selectedUser &&
        (String(message.sender) === String(selectedUser._id) ||
          String(message.receiver) === String(selectedUser._id))
      ) {
        dispatch(setMessages([...(messages || []), message]));
      }
    };

    const handleMessageDeleted = (messageId) => {
      dispatch(deleteMessage(messageId));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, messages, selectedUser, dispatch]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        const result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );

        dispatch(setMessages(result.data || []));
        setSelectedMessages([]);
        setSelectMode(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);

  return (
    <div
      className={`lg:w-[70%] w-full h-full relative ${
        selectedUser ? "flex" : "hidden lg:flex"
      } bg-[#f4f7fb] border-l-2 border-gray-200 overflow-hidden`}
    >
      {selectedUser ? (
        <div className="w-full h-full flex flex-col overflow-hidden relative">
          <div className="w-full h-[85px] shrink-0 bg-[#2d80ed] rounded-b-[25px] shadow-lg flex items-center gap-[15px] px-[15px] z-20">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() =>
                selectMode
                  ? exitSelectMode()
                  : dispatch(setSelectedUser(null))
              }
            >
              <IoIosArrowRoundBack className="w-[40px] h-[40px] text-white" />
            </button>

            {selectMode ? (
              <>
                <h1 className="text-white font-semibold text-[20px]">
                  {selectedMessages.length} selected
                </h1>

                <div className="ml-auto flex items-center gap-[10px]">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-white p-[7px] rounded-full hover:bg-blue-600"
                    title="Select all"
                  >
                    <MdSelectAll className="w-[28px] h-[28px]" />
                  </button>

                  <button
                    type="button"
                    disabled={!selectedMessages.length}
                    onClick={handleDeleteSelected}
                    className={`p-[7px] rounded-full ${
                      selectedMessages.length
                        ? "text-white hover:bg-blue-600"
                        : "text-blue-300"
                    }`}
                    title="Delete selected"
                  >
                    <MdDelete className="w-[27px] h-[27px]" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-[50px] h-[50px] shrink-0 rounded-full overflow-hidden bg-white shadow-lg">
                  <img
                    src={selectedUser.image || dp}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <h1 className="text-white font-semibold text-[20px] truncate">
                    @{selectedUser.userName || "user"}
                  </h1>

                  <span className="text-white text-[13px]">
                    {onlineUsers?.includes(selectedUser._id)
                      ? "online"
                      : selectedUser.lastSeen
                      ? `last seen ${new Date(
                          selectedUser.lastSeen
                        ).toLocaleString()}`
                      : "offline"}
                  </span>
                </div>

                <div className="ml-auto relative">
                  <button
                    type="button"
                    onClick={() => setShowMenu((prev) => !prev)}
                    className="text-white p-[7px] rounded-full hover:bg-blue-600"
                  >
                    <MdMoreVert className="w-[30px] h-[30px]" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-[52px] w-[210px] bg-white rounded-xl shadow-xl overflow-hidden z-[100]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectMode(true);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-[10px] px-[15px] py-[13px] text-gray-700 hover:bg-gray-100"
                      >
                        <MdSelectAll className="w-[22px] h-[22px]" />
                        Select messages
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleSelectAll();
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-[10px] px-[15px] py-[13px] text-gray-700 hover:bg-gray-100"
                      >
                        <MdSelectAll className="w-[22px] h-[22px]" />
                        Select all
                      </button>

                      <button
                        type="button"
                        onClick={handleClearConversation}
                        className="w-full flex items-center gap-[10px] px-[15px] py-[13px] text-red-600 hover:bg-red-50"
                      >
                        <MdDelete className="w-[22px] h-[22px]" />
                        Clear conversation
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="w-full flex-1 min-h-0 overflow-y-auto flex flex-col gap-[18px] py-[25px] px-[15px] pb-[100px]">
            {showPicker && (
              <div className="absolute bottom-[90px] left-[15px] z-[100]">
                <EmojiPicker
                  width={250}
                  height={350}
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            {messages?.map((mess, index) =>
              String(mess.sender) === String(userData?._id) ? (
                <SenderMessage
                  key={mess._id || index}
                  image={mess.image}
                  message={mess.message}
                  messageId={mess._id}
                  selectMode={selectMode}
                  selected={selectedMessages.includes(mess._id)}
                  onSelect={handleSelectMessage}
                />
              ) : (
                <ReceiverMessage
                  key={mess._id || index}
                  image={mess.image}
                  message={mess.message}
                  messageId={mess._id}
                  selectMode={selectMode}
                  selected={selectedMessages.includes(mess._id)}
                  onSelect={handleSelectMessage}
                />
              )
            )}
          </div>

          {!selectMode && (
            <div className="absolute bottom-[15px] left-0 w-full flex justify-center px-[10px] z-30">
              {frontendImage && (
                <img
                  src={frontendImage}
                  alt=""
                  className="w-[75px] h-[75px] object-cover absolute bottom-[75px] right-[15%] rounded-lg shadow-lg border-2 border-white"
                />
              )}

              <form
                onSubmit={handleSendMessage}
                className="w-full max-w-[700px] h-[58px] bg-[#2d80ed] shadow-lg rounded-full flex items-center gap-[15px] px-[18px]"
              >
                <button
                  type="button"
                  onClick={() => setShowPicker((prev) => !prev)}
                  className="shrink-0"
                >
                  <RiEmojiStickerLine className="w-[25px] h-[25px] text-white" />
                </button>

                <input
                  ref={imageRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message"
                  className="w-full min-w-0 h-full px-[5px] outline-none text-[17px] text-white bg-transparent placeholder-white"
                />

                <button
                  type="button"
                  onClick={() => imageRef.current?.click()}
                  className="shrink-0"
                >
                  <FaImages className="w-[25px] h-[25px] text-white" />
                </button>

                {(input.trim() || backendImage) && (
                  <button type="submit" className="shrink-0">
                    <RiSendPlane2Fill className="w-[25px] h-[25px] text-white" />
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#f4f7fb] px-[20px] py-[30px] overflow-y-auto">
          <div className="w-full max-w-[650px]">
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
              Find someone on Talkify
            </h1>

            <p className="text-gray-500 text-[16px] sm:text-[18px] text-center mt-[10px]">
              Search any registered user using their username.
            </p>

            <div className="mt-[30px] relative">
              <div className="w-full h-[62px] bg-white rounded-full shadow-lg flex items-center px-[25px] gap-[15px] border border-gray-200">
                <IoSearch className="w-[27px] h-[27px] text-gray-500 shrink-0" />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search username..."
                  className="w-full h-full outline-none text-[17px] text-gray-700 bg-transparent"
                />
              </div>

              {searchInput && (
                <div className="w-full mt-[10px] bg-white rounded-2xl shadow-xl overflow-hidden max-h-[300px] overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-[20px] text-center text-gray-500">
                      Searching...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-[20px] text-center text-gray-500">
                      No user found
                    </div>
                  ) : (
                    searchResults.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleSelectUser(user)}
                        className="w-full h-[75px] flex items-center gap-[15px] px-[20px] hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                      >
                        <div className="w-[52px] h-[52px] rounded-full overflow-hidden shrink-0">
                          <img
                            src={user.image || dp}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <h2 className="text-gray-800 font-semibold text-[17px] truncate">
                            @{user.userName}
                          </h2>
                          <span className="text-gray-400 text-[14px] truncate">
                            {user.name}
                          </span>
                        </div>

                        {onlineUsers?.includes(user._id) && (
                          <span className="ml-auto w-[12px] h-[12px] rounded-full bg-green-500 border-2 border-white shadow shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageArea;