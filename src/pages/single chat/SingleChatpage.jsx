import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom'
import { getchatinfo, getchatmessagesbyid, sendmessages } from '../../redux/slices/ChatSlice';
import { handlelogidprofiledata } from '../../redux/slices/AuthSlice';
import avatar from '../../../public/avatar.png';
import { Mic, Paperclip, Send, Smile, X } from 'lucide-react';
import Loaderpage from '../../componenets/loader/Loaderpage';
import { ConnectWs } from '../Ws';

const SingleChatpage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const messageRef = useRef(null);

    const socketref = useRef(null);

    const [starttyping, setStartTyping] = useState(false);
    const [form, setForm] = useState({
        text: "",
        image: "",
        video: "",
    });

    const { singlechatdata, singleloading, sngleerror } = useSelector((state) => state.chat.singlechat);
    const { profile, profileloading, profileerror } = useSelector((state) => state.Auth.profiledata);

    useEffect(() => {
        dispatch(getchatmessagesbyid(id));
    }, [id]);

    useEffect(() => {
        dispatch(handlelogidprofiledata(id));
    }, [id]);

    // useEffect(() => {
    //     if (messageRef.current) {
    //         messageRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // }, [singlechatdata])


    useEffect(() => {
        socketref.current = ConnectWs();
    }, [])

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handlechange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (value.trim() === "") {
            setStartTyping(false);
        } else {
            setStartTyping(true);
        }
    }

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





    // handle send messages 
    const handlesendmaessagesreciever = () => {
        const hasMedia = form.image || form.video;

        // If sending only text
        if (!hasMedia) {
            dispatch(sendmessages({
                receiverId: id,
                data: {
                    text: form.text,
                    image: form.image,
                    video: form.video
                }
            }));

        }

        // If sending image or video
        else {
            const payload = new FormData();
            payload.append("text", form.text);
            if (form.image) payload.append("image", form.image);
            if (form.video) payload.append("video", form.video);

            dispatch(sendmessages({
                receiverId: id,
                data: payload,
            }));
        }

        dispatch(getchatinfo());
        setForm({ text: "", image: "", video: "" });
    };



    // if (singleloading || profileloading) {
    //     return <Loaderpage />
    // }



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
            <div className="p-3 flex flex-col gap-y-3 h-[33rem] overflow-y-auto sidebar" style={{ scrollbarWidth: "thin" }}>

                {Array.isArray(singlechatdata) && singlechatdata.length > 0 ? (
                    singlechatdata.map((msg) => {
                        const loggedUserId = profile?._id;
                        const isSender = msg.senderId === loggedUserId;

                        return (
                            <div
                                key={msg._id}
                                className={`w-full flex ${id === msg.recieverId ? "justify-end" : "justify-start"}`}
                            >
                                {msg.text ? (
                                    <div
                                        className={`max-w-xs p-2 rounded-lg text-xs tracking-wider ${isSender
                                            ? "bg-gray-700 text-white"
                                            : "bg-[#17495E] text-white"
                                            }`} > {msg.text}

                                        <p className="text-[8px] text-gray-300 mt-1 text-right">
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className={`max-w-xs p-2 rounded-lg text-xs tracking-wider ${isSender
                                            ? "bg-gray-700 text-white"
                                            : "bg-[#17495E] text-white"
                                            }`} >
                                        <img src={msg.image} className='w-52 object-cover' />

                                        <p className="text-[8px] text-gray-300 mt-1 text-right">
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                ) ? (
                                    <div
                                        className={`max-w-xs p-2 rounded-lg text-xs tracking-wider ${isSender
                                            ? "bg-gray-700 text-white"
                                            : "bg-[#17495E] text-white"
                                            }`} >
                                        <video src={msg.video} controls className='w-52 object-cover' />

                                        <p className="text-[8px] text-gray-300 mt-1 text-right">
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                ) : ("")}
                                <div ref={messageRef} />
                            </div>
                        );
                    })
                ) : (
                    <p>No Chat available...</p>
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



            <div className="border border-[#ccc] fixed bottom-8 left-1/2 xl:-translate-x-1/3 lg:-translate-x-1/3 md:-translate-x-1/3 -translate-x-1/2 2xl:w-[44%] xl:w-[58%] lg:w-[65%] md:w-[70%] w-[80%] bg-[#102030] 
    flex items-center gap-3 px-3 py-2 rounded-lg">

                {/* Emoji Icon */}
                <button><Smile size={17} className="text-white" /></button>

                {/*  File Upload Button */}
                <label className='cursor-pointer'>
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
                {starttyping ? (
                    <button className='cursor-pointer' onClick={handlesendmaessagesreciever}>
                        <Send size={17} />
                    </button>
                ) : (
                    <button className='outline-none cursor-pointer'>
                        <Mic size={17} />
                    </button>
                )}

            </div>




        </section>

    )
}

export default SingleChatpage


// {
//     Array.isArray(singlechatdata) && singlechatdata.length > 0 ? (
//         singlechatdata.map((msg) => {
//             const loggedUserId = profile?._id;
//             const isSender = msg.senderId === loggedUserId;

//             return (
//                 <div
//                     key={msg._id}
//                     className={`w-full flex ${isSender ? "justify-end" : "justify-start"}`}
//                 >
//                     <div
//                         className={`max-w-xs p-2 rounded-lg text-xs tracking-wider space-y-1 ${isSender ? "bg-gray-700 text-white" : "bg-[#17495E] text-white"
//                             }`}
//                     >

//                         {/* TEXT / IMAGE / VIDEO */}
//                         {msg.text && <p className="break-words">{msg.text}</p>}

//                         {msg.image && (
//                             <img
//                                 src={msg.image}
//                                 alt="sent-img"
//                                 className="max-w-[180px] rounded-lg"
//                             />
//                         )}

//                         {msg.video && (
//                             <video
//                                 src={msg.video}
//                                 className="max-w-[200px] rounded-lg"
//                                 controls
//                             />
//                         )}

//                         {/* TIME */}
//                         <p className="text-[8px] text-gray-300 mt-1 text-right">
//                             {formatTime(msg.createdAt)}
//                         </p>
//                     </div>
//                 </div>
//             );
//         })
//     ) : (
//     <p>No Chat available...</p>
// )
// }
