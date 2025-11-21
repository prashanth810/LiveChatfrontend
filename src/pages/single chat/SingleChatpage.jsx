import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom'
import { getchatinfo, getchatmessagesbyid, sendmessages } from '../../redux/slices/ChatSlice';
import { handlelogidprofiledata } from '../../redux/slices/AuthSlice';
import avatar from '../../../public/avatar.png';
import { Mic, Send, Smile, X } from 'lucide-react';
import Loaderpage from '../../componenets/loader/Loaderpage';

const SingleChatpage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const messageRef = useRef(null);

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


    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };



    const handlesendmaessagesreciever = () => {
        dispatch(sendmessages({
            receiverId: id,
            data: {
                text: form.text,
                image: form.imageUrl,
                video: form.videoUrl
            }
        }));
        dispatch(getchatinfo());
        setForm({
            text: "",
            image: "",
            video: "",
        })

        console.log(id, 'iiiiiiiiiiiiiiii')
    }



    const handlechange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (value.trim() === "") {
            setStartTyping(false);
        } else {
            setStartTyping(true);
        }
    }







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
            <div className="p-3 flex flex-col gap-y-3 h-96">

                {Array.isArray(singlechatdata) && singlechatdata.length > 0 ? (
                    singlechatdata.map((msg) => {
                        const loggedUserId = profile?._id;
                        const isSender = msg.senderId === loggedUserId;

                        return (
                            <div
                                key={msg._id}
                                className={`w-full flex ${id === msg.recieverId ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs p-2 rounded-lg text-xs tracking-wider ${isSender
                                        ? "bg-gray-700 text-white"
                                        : "bg-[#17495E] text-white"
                                        }`} > {msg.text}

                                    <p className="text-[8px] text-gray-300 mt-1 text-right">
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
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

            <div className="border border-[#ccc] fixed bottom-10 left-1/2 xl:-translate-x-1/3 lg:-translate-x-1/3 md:-translate-x-1/3 -translate-x-1/2 2xl:w-[44%] xl:w-[58%] lg:w-[65%] md:w-[70%] w-[80%] bg-[#102030] 
                flex items-center gap-3 px-3 py-2 rounded-lg">

                <p><Smile size={17} /></p>

                <textarea name='text' placeholder='Type your message ...' value={form.text} onChange={handlechange}
                    className="w-full text-sm outline-none resize-none overflow-auto sidebar leading-relaxed h-6 bg-transparent text-white"
                    rows="1"
                />

                {starttyping ? (
                    <button className='outline-none cursor-pointer' onClick={handlesendmaessagesreciever}> <Send size={17} /> </button>
                ) : (
                    <button className='outline-none cursor-pointer'><Mic size={17} /></button>
                )}
            </div>



        </section>

    )
}

export default SingleChatpage
