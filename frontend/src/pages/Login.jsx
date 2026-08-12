import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

import loginIllustration from "../assets/loginIllustration.png";

function Login() {
  let navigate = useNavigate();
  let [show, setShow] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");
  let dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );

      dispatch(setUserData(result.data));
      dispatch(setSelectedUser(null));
      navigate("/");
      setEmail("");
      setPassword("");
      setLoading(false);
      setErr("");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eef3fb] flex items-center justify-center p-4">

      <div className="w-full max-w-[1050px] min-h-[620px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col md:flex-row">

        <div className="w-full md:w-[48%] h-[430px] md:h-auto overflow-hidden">
          <img
            src={loginIllustration}
            alt="Talkify"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-[52%] flex items-center justify-center px-7 py-10 md:px-12">

          <div className="w-full max-w-[420px]">

            <div className="mb-8">
              <h1 className="text-[32px] md:text-[36px] font-bold text-gray-800">
                Welcome back! 👋
              </h1>

              <p className="text-gray-500 mt-2 text-[15px]">
                Login to continue chatting with your friends.
              </p>
            </div>

            <form
              className="w-full flex flex-col gap-5"
              onSubmit={handleLogin}
            >

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>

                <div className="w-full h-[54px] border border-gray-300 rounded-xl flex items-center px-4 gap-3 transition-all focus-within:border-[#2583f7] focus-within:ring-2 focus-within:ring-[#2583f7]/20">

                  <MdEmail className="text-gray-400 text-[21px]" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-full outline-none bg-transparent text-gray-700"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />

                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <div className="w-full h-[54px] border border-gray-300 rounded-xl flex items-center px-4 gap-3 transition-all focus-within:border-[#2583f7] focus-within:ring-2 focus-within:ring-[#2583f7]/20">

                  <FaLock className="text-gray-400 text-[18px]" />

                  <input
                    type={show ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-full outline-none bg-transparent text-gray-700"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />

                  <span
                    className="text-[#2583f7] text-sm font-semibold cursor-pointer select-none"
                    onClick={() => setShow((prev) => !prev)}
                  >
                    {show ? "hide" : "show"}
                  </span>

                </div>
              </div>

              {err && (
                <p className="text-red-500 text-sm font-medium">
                  {"*" + err}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[54px] bg-[#2583f7] hover:bg-[#176fd8] text-white rounded-xl font-semibold text-[17px] shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Loading..." : "Login"}
              </button>

            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-[1px] bg-gray-200"></div>

              <span className="text-gray-400 text-sm">
                New to Talkify?
              </span>

              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="w-full h-[52px] border-2 border-[#2583f7] text-[#2583f7] rounded-xl font-semibold hover:bg-[#2583f7] hover:text-white transition-all"
            >
              Create a new account
            </button>

            <p className="text-center text-gray-400 text-xs mt-7">
              Talkify • Connect. Chat. Conquer.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;