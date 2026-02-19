'use client';
import API_BASE_URL from '@/config/api';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function ChatSystem({ currentUser }) {
    const [contacts, setContacts] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // Initialize Socket
    useEffect(() => {
        const token = localStorage.getItem('studentToken') || localStorage.getItem('teacherToken') || localStorage.getItem('adminToken');
        if (!token) return;

        // Extract domain from API_BASE_URL (remove /api) -> e.g. http://localhost:5000
        const socketUrl = API_BASE_URL.replace('/api', '');

        const newSocket = io(socketUrl, {
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log('Connected to Socket.IO');
        });

        newSocket.on('message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    // Fetch Contacts
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem('studentToken') || localStorage.getItem('teacherToken') || localStorage.getItem('adminToken');
                const { data } = await axios.get(`${API_BASE_URL}/messages/targets`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setContacts(data);
            } catch (err) { console.error('Error fetching contacts', err); }
        };
        fetchContacts();
    }, []);

    // Fetch Messages when activeChat changes
    useEffect(() => {
        if (!activeChat) return;

        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('studentToken') || localStorage.getItem('teacherToken') || localStorage.getItem('adminToken');
                const { data } = await axios.get(`${API_BASE_URL}/messages/${activeChat._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(data);
                scrollToBottom();
            } catch (err) { console.error(err); }
        };
        fetchMessages();
    }, [activeChat]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !activeChat) return;

        // Emit to Socket (Optimistic UI update handled by socket listener)
        socket.emit('sendMessage', {
            recipientId: activeChat._id,
            content: newMessage
        });

        setNewMessage('');
    };

    // Filter messages for current chat
    const currentChatMessages = messages.filter(
        m => (m.sender === currentUser._id && m.recipient === activeChat?._id) ||
            (m.sender === activeChat?._id && m.recipient === currentUser._id)
    );

    return (
        <div className="flex h-[600px] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
            {/* Sidebar / Contact List */}
            <div className="w-1/3 border-r border-slate-100 bg-slate-50 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-bold text-slate-700">Messages</h2>
                    <input
                        type="text"
                        placeholder="Search people..."
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <div
                            key={contact._id}
                            onClick={() => setActiveChat(contact)}
                            className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-white transition-all ${activeChat?._id === contact._id ? 'bg-white border-l-4 border-orange-500 shadow-sm' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                {contact.name[0]}
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-sm">{contact.name}</div>
                                <div className="text-xs text-slate-500 capitalize">{contact.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-slate-50/50">
                {activeChat ? (
                    <>
                        {/* Header */}
                        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                    {activeChat.name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{activeChat.name}</div>
                                    <div className="text-xs text-green-500 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {currentChatMessages.map((msg, idx) => {
                                const isMe = msg.sender === currentUser._id;
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${isMe ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-orange-500 transition-all"
                                />
                                <button type="submit" className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                                    <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        </div>
                        <p className="text-lg font-medium">Select a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
