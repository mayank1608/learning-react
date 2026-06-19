import { useDispatch, useSelector } from 'react-redux';
import { getFullName } from '../../utils/utilities';
import { createNewMessage, getMessageByChatId } from '../../services/messageApi';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { clearAllUnreadMessageCount } from '../../services/chatApi';
import store from '../../redux/store';
import { setAllChats } from '../../redux/usersSlice';

export interface IMessage {
  _id: string;
  chatId: string;
  sender: string;
  read: boolean;
  text: string;
  createdAt: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ILastMessage {
  _id: string;
  chatId: string;
  sender: string;
  text: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IChat {
  _id: string;
  members: IUser[];
  unreadMessageCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage?: ILastMessage;
}

const ChatArea = ({ socket }: any) => {
  const { selectedChat, user: loggedinUser, allChats } = useSelector((state: any) => state.userReducer);
  const recepientName = selectedChat.members.find((user: any) => user._id !== loggedinUser._id); // return 2nd id from memberlist
  const [message, setMessage] = useState<string>('');
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);

  const dispatch = useDispatch();

  // on enter key send the message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: loggedinUser._id,
        text: message,
      }

      socket.emit('send-msg', {
        ...newMessage,
        members: selectedChat?.members.map((m: any) => m._id),
        createdAt: Date.now()
      })

      const res: any = await createNewMessage(newMessage);
      if (res.success) {
        setMessage('');
      }
    } catch (error: any) {
      console.log('error', error.message);
    }
  }

  const getAllMessages = async () => {
    try {
      const res: any = await getMessageByChatId(selectedChat._id);
      if (res.success) {
        setAllMessages(res.data);
      }
    } catch (error: any) {
      console.log('error', error.message);
    }
  }

  const formatTime = (timestamp: any) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), 'days')

    if (diff < 1) {
      return `Today ${moment(timestamp).format('hh:mm A')}`;
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format('hh:mm A')}`;
    } else {
      return moment(timestamp).format('MMM D, hh:mm A');
    }
  }

  const clearUnreadMessagesCount = async () => {
    try {
      socket.emit('clear-unread-msg', {
        chatId: selectedChat._id,
        members: selectedChat.members.map((m: any) => m._id)
      })

      const res: any = await clearAllUnreadMessageCount(selectedChat._id);
      if (res.success) {
        allChats.map((chat: any) => {
          if (chat._id === selectedChat._id) {
            return res.data;
          }
        })
      }
    } catch (error: any) {
      console.log('error', error.message);
    }
  }

  useEffect(() => {
    getAllMessages();
    if (selectedChat?.lastMessage?.sender !== loggedinUser._id) {
      clearUnreadMessagesCount();
    }

    // first clear the 'receive-msg' using off method then receive new message using on method and append in existing message list
    socket.off('receive-msg').on('receive-msg', (message: IMessage) => {
      // we cannot get selectedChat reducer directly in socket
      const selectedChat = store.getState().userReducer.selectedChat as IChat | null;
      if (selectedChat && selectedChat._id === message.chatId) {
        setAllMessages((prevmsg: any) => [...prevmsg, message]);
      }

      if (selectedChat?._id === message.chatId && message.sender !== loggedinUser._id) {
        clearUnreadMessagesCount();
      }
    });

    socket.on('msg-count-cleared', (message: IMessage) => {
      const allChats = store.getState().userReducer.allChats as IChat[] | null;
      const selectedChat = store.getState().userReducer.selectedChat as IChat | null;

      if (selectedChat?._id === message.chatId) {
        // updating unreadMessageCount in chat object
        const updatedChats = allChats?.map((chat: IChat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              unreadMessageCount: 0,
            }
          }
          return chat
        })
        dispatch(setAllChats(updatedChats));

        // updating read in message object
        setAllMessages((prevMsgs: IMessage[]) => {
          return prevMsgs.map((msg: IMessage) => {
            return { ...msg, read: true }
          })
        })
      }
    })
  }, [selectedChat]);

  const msgContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const msgContainer = msgContainerRef.current;
    if (msgContainer) {
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  }, [allMessages]);

  return (
    <>
      {console.log('allMessages', allMessages)}
      {selectedChat &&
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            {/* <!--RECEIVER DATA--> */}
            {getFullName(`${recepientName.firstName} ${recepientName.lastName}`)}
          </div>
          {/* <!--Chat Area--> */}
          <div className="main-chat-area" ref={msgContainerRef} id="main-chat-area">
            <div className="message-container">
              {allMessages && allMessages.map((msg: any) => {
                const isCurrentUserSender = msg.sender === loggedinUser._id;
                return <div key={msg._id} className="message-container" style={isCurrentUserSender ? { alignItems: 'end' } : { alignItems: 'start' }}>
                  <div className={isCurrentUserSender ? "send-message" : "received-message"}>
                    {msg.text}
                    {/* <div>{msg.image && <img src={msg.image} alt="image" height="120" width="120"></img>}</div> */}
                  </div>
                  <div className="message-timestamp"
                    style={isCurrentUserSender ? { float: 'right' } : { float: 'left' }}
                  >
                    {formatTime(msg.createdAt)} {isCurrentUserSender && msg.read &&
                      <i className="fa fa-check-circle" aria-hidden="true" style={{ color: '#e74c3c' }}></i>
                    }
                  </div>
                </div>
              })}
            </div>
          </div>
          {/* <!--SEND MESSAGE--> */}
          <div className="send-message-div">
            <input type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={() => sendMessage()}></button>
          </div>
        </div>
      }
    </>
  )
}

export default ChatArea