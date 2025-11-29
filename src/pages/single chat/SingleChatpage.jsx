import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getchatinfo, getchatmessagesbyid, sendmessages } from '../../redux/slices/ChatSlice';
import { handlelogidprofiledata } from '../../redux/slices/AuthSlice';
import avatar from '../../../public/avatar.png';
import { MessageCircle, Mic, Paperclip, Send, Smile, X } from 'lucide-react';
import Loaderpage from '../../componenets/loader/Loaderpage';
import { ConnectWs } from '../Ws';

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


const SingleChatpage = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const messageRef = useRef(null);

    const socketRef = useRef(null);   // ⭐ store socket here

    const [starttyping, setStartTyping] = useState(false);

    const [form, setForm] = useState({
        text: "",
        image: "",
        video: "",
    });
    const [message, setMessage] = useState([]);

    const { singlechatdata } = useSelector((state) => state.chat.singlechat);
    const { profile } = useSelector((state) => state.Auth.profiledata);


    // ⭐ CONNECT socket ONCE
    useEffect(() => {
        socketRef.current = ConnectWs();

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);


    // fetch chats
    useEffect(() => {
        dispatch(getchatmessagesbyid(id));
        dispatch(handlelogidprofiledata(id));
    }, [id]);


    useEffect(() => {
        if (!socketRef.current) return;
        const socket = socketRef.current;

        socket.on("recieve-message", (msg) => {
            console.log("REALTIME:", msg);

            // const isForThisChat =
            //     (msg.senderId === profile?._id && msg.receiverId === id) ||
            //     (msg.receiverId === profile?._id && msg.senderId === id);

            // if (isForThisChat) {
            // ✅ Directly update UI state
            setMessage(prev => [...prev, msg]);
            console.log(message, 'mmmmmmmmmmmmmmmmmmmmmmmm')
            // }
        });

        return () => socket.off("recieve-message");
    }, [id, profile?._id]);




    useEffect(() => {
        if (singlechatdata) {
            setMessage(singlechatdata);
        }
    }, [singlechatdata]);

    // useEffect(() => {
    //     if (messageRef.current) {
    //         messageRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // }, [message]);


    const handlechange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setStartTyping(value.trim() !== "");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (file.type.startsWith("image/")) {
                setForm({ ...form, image: reader.result, video: "" });
            } else if (file.type.startsWith("video/")) {
                setForm({ ...form, video: reader.result, image: "" });
            }
        };
    };


    // ⭐ Send message (API + SOCKET)
    const handlesendmaessagesreciever = () => {
        const hasMedia = form.image || form.video;

        // send to backend
        if (!hasMedia) {
            dispatch(sendmessages({
                receiverId: id,
                data: {
                    text: form.text,
                    image: form.image,
                    video: form.video
                }
            }));
        } else {
            const payload = new FormData();
            payload.append("text", form.text);
            if (form.image) payload.append("image", form.image);
            if (form.video) payload.append("video", form.video);

            dispatch(sendmessages({
                receiverId: id,
                data: payload
            }));
        }

        // ⭐ Real-time socket message
        socketRef.current.emit("message", {
            senderId: profile?._id,
            receiverId: id,
            text: form.text,
            image: form.image,
            video: form.video
        });

        dispatch(getchatinfo());
        setForm({ text: "", image: "", video: "" });
    };

    // quick send messages 
    const sendQuickMessage = (text) => {
        // update UI instantly
        setMessage(prev => [...prev, {
            senderId: profile?._id,
            receiverId: id,
            text,
            createdAt: new Date().toISOString()
        }]);

        // send to backend
        dispatch(sendmessages({
            receiverId: id,
            data: { text }
        }));

        // send to socket
        socketRef.current.emit("message", {
            senderId: profile?._id,
            receiverId: id,
            text
        });
    };



    return (
        <section className='text-white w-full'>

            {profile ? (
                <div className='flex items-center justify-between bg-[#172335] p-3 '>
                    <div className='flex items-center gap-x-2'>
                        <div className='relative'>
                            <img src={profile.profile || avatar} alt={profile.fullName} className='w-12 rounded-2xl' />
                            <p className='bg-[#0483ba] w-2 h-2 rounded-full absolute top-1 left-8.5' />
                        </div>

                        <div>
                            <p className='text-xs capitalize font-semibold'> {profile.fullName} </p>
                            <p className='text-[10px] pt-1 text-gray-400'> Online </p>
                        </div>
                    </div>

                    <div>
                        <NavLink to={'/chat'}> <X /> </NavLink>
                    </div>
                </div>
            ) : "no profile available..."}

            {/* CHAT MESSAGES */}
            <div className="p-3 flex flex-col gap-y-3 h-[33rem] overflow-y-auto"
                style={{ scrollbarWidth: "none" }} >

                {Array.isArray(message) && message.length > 0 ? (
                    message.map((msg, i) => {
                        const loggedUserId = profile?._id;
                        const isSender = msg.senderId === profile?._id;

                        return (
                            <div
                                key={i || msg._id}
                                className={`w-full flex ${loggedUserId === msg.senderId ? "justify-start" : "justify-end"}`}
                            >
                                {msg.text && (
                                    <div className={`max-w-xs p-2 rounded-lg text-xs tracking-wider ${isSender
                                        ? "bg-gray-700 text-white"
                                        : "bg-[#17495E] text-white"
                                        }`} >
                                        {msg.text}

                                        <p className="text-[8px] text-gray-300 mt-1 text-right">
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                )}

                                {msg.image && (
                                    <div className={`max-w-xs p-2 rounded-lg text-xs tracking-wider ${isSender
                                        ? "bg-gray-700 text-white"
                                        : "bg-[#17495E] text-white"
                                        }`} >
                                        <img src={msg.image} className='w-52 object-cover' />
                                        <p className="text-[8px] text-gray-300 mt-1 text-right">
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                )}

                                {msg.video && (
                                    <div className={`max-w-xs p-2 rounded-lg text-xs tracking-wider ${isSender
                                        ? "bg-gray-700 text-white"
                                        : "bg-[#17495E] text-white"
                                        }`} >
                                        <video src={msg.video} controls className='w-52 object-cover' />
                                        <p className="text-[8px] text-gray-300 mt-1 text-right">
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                )}

                                <div ref={messageRef}></div>
                            </div>
                        );
                    })
                ) : (
                    <div className='h-52 flex flex-col items-center justify-center'>
                        <div className="flex flex-col items-center justify-center text-white pt-38 ">

                            {/* Icon Box */}
                            <div className="bg-[#1A3A4E] w-18 h-18 rounded-full flex items-center justify-center mb-4">
                                <MessageCircle size={33} className='text-cyan-500' />
                            </div>

                            {/* Text */}
                            <p className="text-lg font-semibold mb-1"> Start Your Converasation with
                                <span className='text-cyan-400 text-xl capitalize'> {profile.fullName} </span> </p>
                            <p className="text-sm text-gray-300"> This is the beginning of your conversation , Send a message to start </p>

                            <div className='flex items-center gap-x-3 py-5'>
                                <button
                                    onClick={() => sendQuickMessage("Hello 👋")}
                                    className='bg-gray-800 py-2 px-3 text-sm rounded-full hover:bg-cyan-900 transition-all duration-300 cursor-pointer'
                                >
                                    👋 Say Hello
                                </button>

                                <button
                                    onClick={() => sendQuickMessage("How are you? 🤝")}
                                    className='bg-gray-800 py-2 px-4 text-sm rounded-full hover:bg-cyan-900 transition-all duration-300 cursor-pointer'
                                >
                                    🤝 How are you ?
                                </button>

                                <button
                                    onClick={() => sendQuickMessage("Shall we meet soon? 🧑‍🤝‍🧑")}
                                    className='bg-gray-800 py-2 px-4 text-sm rounded-full hover:bg-cyan-900 transition-all duration-300 cursor-pointer'
                                >
                                    🧑‍🤝‍🧑 Meet up soon ?
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>

            {/* <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-primary">What kind of nonsense is this</div>
            </div>
            <img src={avatar} className='w-5' />

            <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-info">Calm down, Anakin.</div>
            </div> */}

            {(form.image || form.video) && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 
                  px-3 w-full flex justify-center">

                    {/* IMAGE PREVIEW */}
                    {form.image && (
                        <div className="relative w-fit border border-[#ccc]">
                            <img
                                src={form.image}
                                className="max-h-55 max-w-[80vw] rounded-lg object-cover"
                            />
                            <button
                                onClick={() => setForm({ ...form, image: "", video: "" })}
                                className="absolute -top-1 -right-1 bg-black/80 text-white text-xs px-1 rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* VIDEO PREVIEW */}
                    {form.video && (
                        <div className="relative w-fit">
                            <video
                                src={form.video}
                                controls
                                className="max-h-40 max-w-[80vw] rounded-lg"
                            />
                            <button
                                onClick={() => setForm({ ...form, image: "", video: "" })}
                                className="absolute -top-1 -right-1 bg-black/80 text-white text-xs px-1 rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                </div>
            )}



            {message.length > 0 ? (
                <div className="border border-[#1a3548] fixed bottom-8 left-1/2 xl:-translate-x-1/3 lg:-translate-x-1/3 md:-translate-x-1/3 -translate-x-1/2 2xl:w-[44%] xl:w-[58%] lg:w-[65%] md:w-[70%] w-[80%] bg-[#102030] 
    flex items-center gap-4 px-3 py-3 rounded-lg">

                    {/* Emoji Icon */}
                    <button className='cursor-pointer'><Smile size={17} className="text-white hover:text-cyan-600 transition-all duration-300" /></button>

                    {/*  File Upload Button */}
                    <label className='cursor-pointer hover:text-cyan-600 transition-all duration-300'>
                        <Paperclip size={17} />
                        <input type='file' accept='/*,/*' className='hidden' onChange={handleFileChange} />
                    </label>

                    {/* Text Input */}
                    <textarea
                        name='text'
                        placeholder='Type your message ...'
                        value={form.text}
                        onChange={handlechange}
                        className="w-full text-sm outline-none resize-none overflow-auto sidebar leading-relaxed h-6 bg-transparent text-white"
                        rows="1"
                    />

                    {/* Send / Mic Button */}
                    {form.image || form.video || starttyping ? (
                        <button className='cursor-pointer' onClick={handlesendmaessagesreciever}>
                            <Send size={17} />
                        </button>
                    ) : (
                        <button className='outline-none cursor-pointer'>
                            <Mic size={17} className='hover:text-cyan-600 transition-all duration-300' />
                        </button>
                    )}

                </div>
            ) : (
                null
            )}




        </section>
    );
};

export default SingleChatpage;
