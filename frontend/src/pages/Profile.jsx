import React, { useRef, useState } from 'react'
import dp from "../assets/dp.webp"
import { IoCameraOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../main'
import { setUserData } from '../redux/userSlice'

function Profile() {
    let { userData } = useSelector(state => state.user)
    let dispatch = useDispatch()
    let navigate = useNavigate()

    let [name, setName] = useState(userData.name || "")
    let [frontendImage, setFrontendImage] = useState(userData.image || dp)
    let [backendImage, setBackendImage] = useState(null)
    let image = useRef()
    let [saving, setSaving] = useState(false)

    const handleImage = (e) => {
        let file = e.target.files[0]

        if (!file) return

        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleProfile = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            let formData = new FormData()
            formData.append("name", name)

            if (backendImage) {
                formData.append("image", backendImage)
            }

            let result = await axios.put(
                `${serverUrl}/api/user/profile`,
                formData,
                { withCredentials: true }
            )

            setSaving(false)
            dispatch(setUserData(result.data))
            navigate("/")
        } catch (error) {
            console.log(error)
            setSaving(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#eef5ff] via-[#f7faff] to-[#e7f1ff] flex items-center justify-center px-[15px] py-[30px]">

            <button
                className="fixed top-[20px] left-[20px] w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 z-20"
                onClick={() => navigate("/")}
            >
                <IoIosArrowRoundBack className="w-[34px] h-[34px] text-[#2D7FF0]" />
            </button>

            <div className="w-full max-w-[520px] bg-white rounded-[28px] shadow-xl px-[25px] sm:px-[45px] py-[35px] flex flex-col items-center">

                <div className="text-center mb-[25px]">
                    <h1 className="text-[28px] font-bold text-gray-800">
                        My Profile
                    </h1>
                    <p className="text-gray-400 text-[15px] mt-[5px]">
                        Manage your profile information
                    </p>
                </div>

                <div
                    className="relative cursor-pointer group mb-[28px]"
                    onClick={() => image.current.click()}
                >
                    <div className="w-[155px] h-[155px] rounded-full p-[4px] bg-gradient-to-br from-[#2D7FF0] to-[#20c7ff] shadow-lg">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <img
                                src={frontendImage}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-[3px] right-[3px] w-[44px] h-[44px] rounded-full bg-[#2D7FF0] border-[3px] border-white flex justify-center items-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <IoCameraOutline className="text-white w-[24px] h-[24px]" />
                    </div>
                </div>

                <form
                    className="w-full flex flex-col gap-[18px]"
                    onSubmit={handleProfile}
                >

                    <input
                        type="file"
                        accept="image/*"
                        ref={image}
                        hidden
                        onChange={handleImage}
                    />

                    <div className="w-full">
                        <label className="block text-[14px] font-semibold text-gray-600 mb-[7px] ml-[5px]">
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full h-[52px] outline-none border border-gray-200 px-[18px] bg-[#f8fafc] rounded-xl text-gray-700 text-[17px] focus:border-[#2D7FF0] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-[14px] font-semibold text-gray-600 mb-[7px] ml-[5px]">
                            Username
                        </label>

                        <input
                            type="text"
                            readOnly
                            className="w-full h-[52px] outline-none border border-gray-200 px-[18px] bg-gray-100 rounded-xl text-gray-400 text-[17px] cursor-not-allowed"
                            value={userData?.userName}
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-[14px] font-semibold text-gray-600 mb-[7px] ml-[5px]">
                            Email
                        </label>

                        <input
                            type="email"
                            readOnly
                            className="w-full h-[52px] outline-none border border-gray-200 px-[18px] bg-gray-100 rounded-xl text-gray-400 text-[17px] cursor-not-allowed"
                            value={userData?.email}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full h-[54px] mt-[10px] bg-[#2D7FF0] text-white rounded-xl shadow-md text-[17px] font-semibold hover:bg-[#246fd4] hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : "Save Profile"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Profile