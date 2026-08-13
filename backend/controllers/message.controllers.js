import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage=async (req,res)=>{
    try {
        let sender=req.userId
        let {receiver}=req.params
        let {message}=req.body

        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }

        let conversation=await Conversation.findOne({
            partcipants:{$all:[sender,receiver]}
        })

        let newMessage=await Message.create({
            sender,receiver,message,image
        })

        if(!conversation){
            conversation=await Conversation.create({
                partcipants:[sender,receiver],
                messages:[newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }

        const receiverSocketId=getReceiverSocketId(receiver)

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        return res.status(201).json(newMessage)

    } catch (error) {
        return res.status(500).json({message:`send Message error ${error}`})
    }
}

export const getMessages=async (req,res)=>{
    try {
        let sender=req.userId
        let {receiver}=req.params

        let conversation=await Conversation.findOne({
            partcipants:{$all:[sender,receiver]}
        }).populate("messages")

        return res.status(200).json(conversation?.messages)
    } catch (error) {
        return res.status(500).json({message:`get Message error ${error}`})
    }
}

export const deleteMessage=async (req,res)=>{
    try {
        let userId=req.userId
        let {messageId}=req.params

        let message=await Message.findById(messageId)

        if(!message){
            return res.status(404).json({message:"Message not found"})
        }

        if(message.sender.toString() !== userId.toString()){
            return res.status(403).json({message:"You can only delete your own message"})
        }

        await Conversation.updateMany(
            {messages:messageId},
            {$pull:{messages:messageId}}
        )

        const receiverSocketId=getReceiverSocketId(message.receiver.toString())

        if(receiverSocketId){
            io.to(receiverSocketId).emit("messageDeleted",messageId)
        }

        await Message.findByIdAndDelete(messageId)

        return res.status(200).json({
            message:"Message deleted successfully",
            messageId
        })

    } catch (error) {
        return res.status(500).json({message:`delete Message error ${error}`})
    }
}