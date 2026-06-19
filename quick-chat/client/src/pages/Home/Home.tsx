import { useSelector } from "react-redux";
import useDocumentTitle from "../../hooks/useDocumentTitle"
import ChatArea from "./ChatArea";
import Header from "./Header";
import './Home.css'
import Sidebar from "./Sidebar";
import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io('http://localhost:5000');

const Home = () => {
    useDocumentTitle("Home | Quick Chat");
    const { selectedChat, user: loggedinUser } = useSelector((state: any) => state.userReducer);

    useEffect(() => {
        if (loggedinUser) {
            socket.emit('join-room', (loggedinUser._id))
        }
    }, [loggedinUser])

    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <Sidebar socket={socket} />
                {selectedChat && <ChatArea socket={socket} />}
            </div>
        </div>
    )
}

export default Home