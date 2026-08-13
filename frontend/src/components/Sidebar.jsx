import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { setSearchData, setSelectedUser, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";

function SideBar() {
  let {
    userData,
    otherUsers,
    selectedUser,
    onlineUsers,
    searchData,
  } = useSelector((state) => state.user);

  let [search, setSearch] = useState(false);
  let [input, setInput] = useState("");

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      dispatch(setSearchData([]));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (!input.trim()) {
      dispatch(setSearchData([]));
      return;
    }

    const query = input.toLowerCase().trim();

    const filteredUsers =
      otherUsers?.filter((user) =>
        user.userName?.toLowerCase().includes(query)
      ) || [];

    dispatch(setSearchData(filteredUsers));
  };

  useEffect(() => {
    handleSearch();
  }, [input, otherUsers]);

  return (
    <div
      className={`lg:w-[30%] w-full h-full min-h-0 overflow-hidden lg:flex flex-col bg-slate-200 relative ${
        !selectedUser ? "flex" : "hidden"
      }`}
    >
      <div
        className="w-[55px] h-[55px] rounded-full flex items-center justify-center bg-[#2D7FF0] text-white shadow-lg fixed bottom-[20px] left-[15px] cursor-pointer z-[200]"
        onClick={handleLogOut}
      >
        <BiLogOutCircle className="w-[27px] h-[27px]" />
      </div>

      {input.length > 0 && (
        <div className="flex absolute top-[250px] bg-white w-full max-h-[500px] overflow-y-auto items-center pt-[20px] flex-col gap-[10px] z-[150] shadow-xl">
          {searchData?.length > 0 ? (
            searchData.map((user) => (
              <div
                key={user._id}
                className="w-[95%] min-h-[70px] flex items-center gap-[20px] px-[10px] hover:bg-blue-50 border-b border-gray-200 cursor-pointer rounded-lg"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  setInput("");
                  setSearch(false);
                }}
              >
                <div className="relative rounded-full bg-white flex justify-center items-center shrink-0">
                  <div className="w-[55px] h-[55px] rounded-full overflow-hidden flex justify-center items-center">
                    <img
                      src={user.image || dp}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {onlineUsers?.includes(user._id) && (
                    <span className="w-[12px] h-[12px] rounded-full absolute bottom-[3px] right-[-1px] bg-[#3aff20] shadow-md border-2 border-white"></span>
                  )}
                </div>

                <h1 className="text-gray-800 font-semibold text-[18px] truncate">
                  @{user.userName}
                </h1>
              </div>
            ))
          ) : (
            <div className="py-[25px] text-gray-500 text-[16px]">
              No conversation found
            </div>
          )}
        </div>
      )}

      <div className="w-full min-h-[300px] bg-[#2D7FF0] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px] shrink-0">
        <h1 className="text-white font-bold text-[25px]">Talkify</h1>

        <div className="w-full flex justify-between items-center gap-[15px]">
          <h1 className="text-white font-bold text-[24px] truncate">
            Hii, {userData?.name || "user"}
          </h1>

          <div
            className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-lg shrink-0"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData?.image || dp}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="w-full flex items-center gap-[20px] overflow-x-auto overflow-y-hidden py-[18px]">
          {!search && (
            <div
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-white shadow-lg cursor-pointer shrink-0"
              onClick={() => setSearch(true)}
            >
              <IoIosSearch className="w-[27px] h-[27px] text-gray-700" />
            </div>
          )}

          {search && (
            <form
              className="w-full min-w-0 h-[60px] bg-white shadow-lg flex items-center gap-[10px] rounded-full overflow-hidden px-[20px]"
              onSubmit={(e) => e.preventDefault()}
            >
              <IoIosSearch className="w-[25px] h-[25px] text-gray-600 shrink-0" />

              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full h-full min-w-0 p-[10px] text-[17px] outline-none border-0"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                autoFocus
              />

              <RxCross2
                className="w-[25px] h-[25px] cursor-pointer text-gray-600 shrink-0"
                onClick={() => {
                  setSearch(false);
                  setInput("");
                  dispatch(setSearchData([]));
                }}
              />
            </form>
          )}

          {!search &&
            otherUsers?.map(
              (user) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    key={user._id}
                    className="relative rounded-full bg-white shadow-lg flex justify-center items-center cursor-pointer shrink-0"
                    onClick={() => dispatch(setSelectedUser(user))}
                  >
                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                      <img
                        src={user.image || dp}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <span className="w-[12px] h-[12px] rounded-full absolute bottom-[5px] right-[-1px] bg-[#3aff20] shadow-md border-2 border-white"></span>
                  </div>
                )
            )}
        </div>
      </div>

      <div className="w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-[18px] items-center mt-[20px] pb-[90px]">
        {otherUsers?.map((user) => (
          <div
            key={user._id}
            className="w-[94%] min-h-[62px] flex items-center gap-[18px] shadow-md bg-white rounded-full hover:bg-blue-50 cursor-pointer transition px-[10px]"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="relative rounded-full bg-white flex justify-center items-center shrink-0">
              <div className="w-[58px] h-[58px] rounded-full overflow-hidden flex justify-center items-center">
                <img
                  src={user.image || dp}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              {onlineUsers?.includes(user._id) && (
                <span className="w-[12px] h-[12px] rounded-full absolute bottom-[3px] right-[-1px] bg-[#3aff20] shadow-md border-2 border-white"></span>
              )}
            </div>

            <h1 className="text-gray-800 font-semibold text-[19px] truncate">
              @{user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;