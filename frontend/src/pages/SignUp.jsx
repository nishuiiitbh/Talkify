import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import signupIllustration from "../assets/loginIllustration.png"

function SignUp() {
  let navigate = useNavigate()
  let [show, setShow] = useState(false)
  let [userName, setUserName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")
  let dispatch = useDispatch()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          userName,
          email,
          password
        },
        { withCredentials: true }
      )

      dispatch(setUserData(result.data))
      navigate("/profile")

      setEmail("")
      setPassword("")
      setLoading(false)
      setErr("")
    } catch (error) {
      console.log(error)
      setLoading(false)
      setErr(error?.response?.data?.message)
    }
  }

  return (
    <div className='min-h-screen w-full bg-[#eef3fb] flex items-center justify-center p-4'>
      <div className='w-full max-w-[1050px] min-h-[620px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col md:flex-row'>

        <div className='w-full md:w-[48%] h-[400px] md:h-auto bg-[#20c7ff] overflow-hidden flex items-center justify-center'>
          <img
            src={signupIllustration}
            alt="Talkify"
            className='w-full h-full object-cover'
          />
        </div>

        <div className='w-full md:w-[52%] bg-white flex items-center justify-center px-7 py-10 md:px-12'>
          <div className='w-full max-w-[420px]'>

            <div className='mb-8'>
              <h1 className='text-[32px] md:text-[36px] font-bold text-gray-800'>
                Create your account 👋
              </h1>
              <p className='text-gray-500 mt-2 text-[15px]'>
                Join Talkify and start chatting with your friends.
              </p>
            </div>

            <form
              className='w-full flex flex-col gap-5'
              onSubmit={handleSignUp}
            >

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Username
                </label>
                <input
                  type="text"
                  placeholder='Enter your username'
                  className='w-full h-[54px] border border-gray-300 rounded-xl px-4 outline-none text-gray-700 focus:border-[#2583f7] focus:ring-2 focus:ring-[#2583f7]/20 transition-all'
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email
                </label>
                <input
                  type="email"
                  placeholder='Enter your email'
                  className='w-full h-[54px] border border-gray-300 rounded-xl px-4 outline-none text-gray-700 focus:border-[#2583f7] focus:ring-2 focus:ring-[#2583f7]/20 transition-all'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Password
                </label>

                <div className='w-full h-[54px] border border-gray-300 rounded-xl flex items-center px-4 transition-all focus-within:border-[#2583f7] focus-within:ring-2 focus-within:ring-[#2583f7]/20'>
                  <input
                    type={show ? "text" : "password"}
                    placeholder='Enter your password'
                    className='w-full h-full outline-none bg-transparent text-gray-700'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />

                  <span
                    className='text-[#2583f7] text-sm font-semibold cursor-pointer select-none'
                    onClick={() => setShow(prev => !prev)}
                  >
                    {show ? "hide" : "show"}
                  </span>
                </div>
              </div>

              {err && (
                <p className='text-red-500 text-sm font-medium'>
                  {"*" + err}
                </p>
              )}

              <button
                type='submit'
                disabled={loading}
                className='w-full h-[54px] bg-[#2583f7] hover:bg-[#176fd8] text-white rounded-xl font-semibold text-[17px] shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2'
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>

            </form>

            <div className='flex items-center gap-3 my-7'>
              <div className='flex-1 h-[1px] bg-gray-200'></div>
              <span className='text-gray-400 text-sm'>
                Already have an account?
              </span>
              <div className='flex-1 h-[1px] bg-gray-200'></div>
            </div>

            <button
              type='button'
              onClick={() => navigate("/login")}
              className='w-full h-[52px] border-2 border-[#2583f7] text-[#2583f7] rounded-xl font-semibold hover:bg-[#2583f7] hover:text-white transition-all'
            >
              Login
            </button>

            <p className='text-center text-gray-400 text-xs mt-7'>
              Talkify • Connect. Chat. Conquer.
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}

export default SignUp