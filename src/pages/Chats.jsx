import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import "../../src/styles/scrollbar.css";
import Navbar from "@/components/Navbar";

export default function Chats() {
  const [socket, setSocket] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  let loaclhost = "http://localhost:5000";
  let publichost = "https://chat-app-backend-smoky.vercel.app/";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setSenderId(decodedToken.id);
  }, []);

  useEffect(() => {
    // Connect to Socket.io
    const newSocket = io(publichost);
    setSocket(newSocket);

    // Register the user with Socket.io
    newSocket.emit("register", senderId);

    // Listen for incoming messages
    newSocket.on("receive_private_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [senderId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://chat-app-backend-smoky.vercel.app/api/v1/users",
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (senderId && receiverId) {
          const response = await axios.get(
            `https://chat-app-backend-smoky.vercel.app/api/v1/messages/${senderId}/${receiverId}`,
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          );
          setMessages(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (receiverId) {
      fetchMessages();
      const selectedUser = users.find((user) => user._id === receiverId);
      setActiveChat(selectedUser || null);
    }
  }, [receiverId, users]);

  useEffect(() => {
    if (receiverId && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [receiverId, messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      sender: senderId,
      receiver: receiverId,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Send message via Socket.io
    socket.emit("send_private_message", messageData);

    // Optimistically update UI
    setMessages((prev) => [...prev, messageData]);

    try {
      await axios.post(
        "https://chat-app-backend-smoky.vercel.app/api/v1/messages",
        messageData,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-gradient-to-br from-gray-900 to-indigo-900">
        {/* Chat list */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Chats</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-125px)]">
            {users?.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/chats/${senderId}/${user._id}`)}
                className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors ${
                  activeChat?._id === user._id ? "bg-gray-700/50" : ""
                }`}
              >
                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <h3 className="font-semibold text-white">{user.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="w-full md:w-2/3 lg:w-3/4 hidden flex-1 md:flex flex-col">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {activeChat.name}
                  </h2>
                  <button
                    onClick={() => {
                      navigate("/chats");
                      setActiveChat(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === senderId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[50%] rounded-lg p-3 ${
                        message.sender === senderId
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      <p className="text-sm break-words">{message.message}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {moment(message.timestamp).format("hh:mm A")}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="flex-1 rounded-lg bg-gray-700 text-white border border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400">Select a chat to start</p>
            </div>
          )}
        </div>

        {/* Mobile chat area */}
        {activeChat ? (
          <div className="absolute top-0 left-0 z-10 bg-gradient-to-br from-gray-900 to-indigo-900 w-full  md:hidden flex-1 flex flex-col">
            <div>
              <>
                <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeChat.image}
                      alt={activeChat.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <h2 className="text-xl font-bold text-white">
                      {activeChat.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/chats");
                      setActiveChat(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 h-[calc(100vh-150px)] overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === senderId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[50%] rounded-lg p-3 ${
                          message.sender === senderId
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        <p className="text-sm break-words">{message.message}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {moment(message.timestamp).format("hh:mm A")}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="flex-1 rounded-lg bg-gray-700 text-white border border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
