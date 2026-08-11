import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (res, req) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;
    let { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let conversation = await Conversation.findOne({
      partcipants: { $all: [sender, receiver] },
    });

    let newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        partcipants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: `send message error ${error}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] }
    }).populate("messages");

    if (!conversation) {
      return res.status(400).json({
        message: "conversation not found"
      });
    }

    return res.status(200).json(conversation?.messages);
  } catch (error) {

    return res.status(500).json({ message: `get message error ${error}` });
  }
};
