import http from "http"
import express from "express"
import { Server } from "socket.io"
import User from "../models/user.model.js"

let app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

const userSocketMap = {}

export const getReceiverSocketId = (receiver) => {
    return userSocketMap[receiver]
}

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId

    if (userId != undefined) {
        userSocketMap[userId] = socket.id
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", async () => {

        if (userId != undefined) {

            delete userSocketMap[userId]

            const user = await User.findByIdAndUpdate(
                userId,
                {
                    lastSeen: new Date()
                },
                {
                    new: true
                }
            )

            io.emit("getOnlineUsers", Object.keys(userSocketMap))

            io.emit("updateLastSeen", {
                userId,
                lastSeen: user.lastSeen
            })
        }
    })
})

export { app, server, io }