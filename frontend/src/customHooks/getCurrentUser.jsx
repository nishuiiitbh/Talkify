import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

const getCurrentUser = () => {
  let dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(
          `${serverUrl}/api/user/current`,
          {
            withCredentials: true
          }
        )

        console.log("CURRENT USER RESPONSE:", result.data)

        dispatch(setUserData(result.data))
      } catch (error) {
        console.log("CURRENT USER ERROR:", error)
      }
    }

    fetchUser()
  }, [])
}

export default getCurrentUser