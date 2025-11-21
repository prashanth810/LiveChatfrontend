import axios from 'axios';

const HttpCliennt = axios.create({
    baseURL: "http://localhost:8010/api/auth",
    withCredentials: true,
})

export default HttpCliennt;