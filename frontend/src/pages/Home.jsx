import React from 'react'
import SideBar from '../components/SideBar'
import MessageArea from '../components/MessageArea'
import { useSelector } from 'react-redux'
import getMessage from '../customHooks/getMessages'
import getOtherUsers from '../customHooks/getOtherUsers'

function Home() {
    let { selectedUser } = useSelector(state => state.user)

    getMessage()
    getOtherUsers()

    return (
        <div className='w-full h-[100vh] flex'>
            <SideBar />
            <MessageArea />
        </div>
    )
}

export default Home