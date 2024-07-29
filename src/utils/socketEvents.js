const mongoose = require("mongoose");
const ChatModel = require("../models/chatModel.js");
const { TournamentModel } = require("../models/tournamentModel.js");
const { UserModel } = require("../models/userModel.js");

async function handleJoinTournament(socket, tournamentId) {
  socket.join(tournamentId);
  console.log(`User ${socket.id} joined tournament ${tournamentId}`);

  try {
    // Convert tournamentId to Mongoose ObjectId
    const objectId = new mongoose.Types.ObjectId(tournamentId);

    // Fetch existing messages for the tournament from the database
    const messages = await ChatModel.find({ tournamentId: objectId }).sort({
      createdAt: 1, // Sort messages by creation date in ascending order
    });

    // Fetch usernames for all user IDs found in the messages
    const userIds = [...new Set(messages.map((msg) => msg.userId.toString()))]; // Create a unique set of user IDs
    const users = await UserModel.find({ _id: { $in: userIds } }); // Query users by user IDs
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user.username; // Map user ID to username
      return acc;
    }, {});

    // Include usernames in messages
    const messagesWithUsernames = messages.map((msg) => ({
      ...msg.toObject(), // Convert Mongoose document to object
      username: userMap[msg.userId.toString()] || "Unknown User", // Add username or default to "Unknown User"
    }));

    // Send the messages with usernames to the client
    socket.emit("load_messages", messagesWithUsernames);
  } catch (error) {
    console.error("Error joining room:", error); // Log error if any occurs
  }
}

async function handleSendMessage(io, data) {
  const { message, userId, tournamentId } = data;

  try {
    // Create a new chat message document
    const newChat = new ChatModel({
      message,
      userId,
      tournamentId,
    });
    await newChat.save(); // Save the chat message to the database

    // Update the tournament document to include the new chat message
    await TournamentModel.findByIdAndUpdate(
      tournamentId,
      { $push: { chats: newChat._id } }, // Add the new message ID to the tournament's chats array
      { new: true } // Return the updated document
    );

    // Broadcast the new message to all clients in the specified room
    io.to(tournamentId).emit("receive_message", data);
    console.log(data); // Log the data being sent
  } catch (error) {
    console.error("Error sending message:", error); // Log error if any occurs
  }
}

function handleDisconnect(socket) {
  console.log(`User Disconnected: ${socket.id}`);
}

module.exports = {
  handleJoinTournament,
  handleSendMessage,
  handleDisconnect,
};
