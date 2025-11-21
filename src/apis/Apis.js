import HttpCliennt from "../services/Service"

// handle sign up api 
export const handleSignup = (data) => {
    return HttpCliennt.post(`/register`, data);
}

// handle login api 
export const handlelogin = (data) => {
    return HttpCliennt.post("/login", data);
}

// handle contact info api 
export const handlegetcontactinfo = () => {
    return HttpCliennt.get(`/message/contacts`);
}

// handle chat messages info api 
export const handlegetchatinfo = () => {
    return HttpCliennt.get(`/message/chats`);
}

// handle chat messages get by message id info api 
export const handlegetchatgetbyid = (recieverId) => {
    return HttpCliennt.get(`/message/chats/${recieverId}`);
}

// handle get logined in user data api 
export const handlegetlogiedinuserdata = (id) => {
    return HttpCliennt.get(`/profile/${id}`);
}

export const handlesendmessages = (receiverId, data) => {
    return HttpCliennt.post(`/message/send/${receiverId}`, data)
}