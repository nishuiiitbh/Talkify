import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoIosSearch } from "react-icons/io"
import { RxCross2 } from "react-icons/rx"
import { BiLogOutCircle } from "react-icons/bi"
import { serverUrl } from '../main'
import axios from 'axios'
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function SideBar() {
    let { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user)
    let [search, setSearch] = useState(false)
    let [input, setInput] = useState("")

    let dispatch = useDispatch()
    let navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            dispatch(setOtherUsers(null))
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const handlesearch = async () => {
        try {
            let result = await axios.get(
                `${serverUrl}/api/user/search?query=${input}`,
                { withCredentials: true }
            )
            dispatch(setSearchData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (input) {
            handlesearch()
        }
    }, [input])

    return (
        <div
            className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-200 relative ${
                !selectedUser ? "block" : "hidden"
            }`}
        >

            <div
                className="w-[55px] h-[55px] rounded-full flex items-center justify-center bg-[#2D7FF0] text-white shadow-lg fixed bottom-[20px] left-[15px] cursor-pointer z-[200]"
                onClick={handleLogOut}
            >
                <BiLogOutCircle className="w-[27px] h-[27px]" />
            </div>

            {input.length > 0 && (
                <div className="flex absolute top-[250px] bg-white w-full h-[500px] overflow-y-auto items-center pt-[20px] flex-col gap-[10px] z-[150] shadow-xl">

                    {searchData?.map((user) => (
                        <div
                            key={user._id}
                            className="w-[95%] h-[70px] flex items-center gap-[20px] px-[10px] hover:bg-blue-50 border-b border-gray-200 cursor-pointer rounded-lg"
                            onClick={() => {
                                dispatch(setSelectedUser(user))
                                setInput("")
                                setSearch(false)
                            }}
                        >
                            <div className="relative rounded-full bg-white flex justify-center items-center">

                                <div className="w-[55px] h-[55px] rounded-full overflow-hidden flex justify-center items-center">
                                    <img
                                        src={user.image || dp}
                                        alt=""
                                        className="h-full"
                                    />
                                </div>

                                {onlineUsers?.includes(user._id) && (
                                    <span className="w-[12px] h-[12px] rounded-full absolute bottom-[3px] right-[-1px] bg-[#3aff20] shadow-md border-2 border-white"></span>
                                )}

                            </div>

                            <h1 className="text-gray-800 font-semibold text-[18px]">
                                {user.name || user.userName}
                            </h1>
                        </div>
                    ))}

                </div>
            )}

            <div className="w-full h-[300px] bg-[#2D7FF0] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]">

                <h1 className="text-white font-bold text-[25px]">
                    Talkify
                </h1>

                <div className="w-full flex justify-between items-center">

                    <h1 className="text-white font-bold text-[24px]">
                        Hii, {userData?.name || "user"}
                    </h1>

                    <div
                        className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-lg"
                        onClick={() => navigate("/profile")}
                    >
                        <img
                            src={userData?.image || dp}
                            alt=""
                            className="h-full"
                        />
                    </div>

                </div>

                <div className="w-full flex items-center gap-[20px] overflow-y-auto py-[18px]">

                    {!search && (
                        <div
                            className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-white shadow-lg cursor-pointer"
                            onClick={() => setSearch(true)}
                        >
                            <IoIosSearch className="w-[27px] h-[27px] text-gray-700" />
                        </div>
                    )}

                    {search && (
                        <form className="w-full h-[60px] bg-white shadow-lg flex items-center gap-[10px] rounded-full overflow-hidden px-[20px]">

                            <IoIosSearch className="w-[25px] h-[25px] text-gray-600" />

                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full h-full p-[10px] text-[17px] outline-none border-0"
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                            />

                            <RxCross2
                                className="w-[25px] h-[25px] cursor-pointer text-gray-600"
                                onClick={() => {
                                    setSearch(false)
                                    setInput("")
                                }}
                            />

                        </form>
                    )}

                    {!search &&
                        otherUsers?.map((user) =>
                            onlineUsers?.includes(user._id) && (
                                <div
                                    key={user._id}
                                    className="relative rounded-full bg-white shadow-lg flex justify-center items-center cursor-pointer"
                                    onClick={() => dispatch(setSelectedUser(user))}
                                >

                                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                                        <img
                                            src={user.image || dp}
                                            alt=""
                                            className="h-full"
                                        />
                                    </div>

                                    <span className="w-[12px] h-[12px] rounded-full absolute bottom-[5px] right-[-1px] bg-[#3aff20] shadow-md border-2 border-white"></span>

                                </div>
                            )
                        )}

                </div>
            </div>

            <div className="w-full h-[50%] overflow-auto flex flex-col gap-[18px] items-center mt-[20px]">

                {otherUsers?.map((user) => (
                    <div
                        key={user._id}
                        className="w-[94%] h-[62px] flex items-center gap-[18px] shadow-md bg-white rounded-full hover:bg-blue-50 cursor-pointer transition"
                        onClick={() => dispatch(setSelectedUser(user))}
                    >

                        <div className="relative rounded-full bg-white flex justify-center items-center">

                            <div className="w-[58px] h-[58px] rounded-full overflow-hidden flex justify-center items-center">
                                <img
                                    src={user.image || dp}
                                    alt=""
                                    className="h-full"
                                />
                            </div>

                            {onlineUsers?.includes(user._id) && (
                                <span className="w-[12px] h-[12px] rounded-full absolute bottom-[3px] right-[-1px] bg-[#3aff20] shadow-md border-2 border-white"></span>
                            )}

                        </div>

                        <h1 className="text-gray-800 font-semibold text-[19px]">
                            {user.name || user.userName}
                        </h1>

                    </div>
                ))}

            </div>

        </div>
    )
}

export default SideBar