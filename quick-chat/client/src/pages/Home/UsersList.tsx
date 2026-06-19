import { useDispatch, useSelector } from "react-redux";
import { getFullName, getInitials } from "../../utils/utilities";
import { createNewChat } from "../../services/chatApi";
import { setAllChats, setSelectedChat } from "../../redux/usersSlice";
import { Fragment } from "react/jsx-runtime";
import moment from "moment";
import { useEffect } from "react";
import store from "../../redux/store";
import { type IChat, type IMessage } from "../Home/ChatArea"

const UsersList = ({ searchKey, socket }: any) => {
  const { allUsers, allChats, user: currentUser, selectedChat } = useSelector((state: any) => state.userReducer);
  const dispatch = useDispatch();

  const getData = () => {
    console.log("getData called")
    if (searchKey === "") {
      return allChats;
    } else {
      return allUsers?.filter((user: any) => {
        return user?.firstName?.toLowerCase().includes(searchKey?.toLowerCase()) ||
          user?.lastName?.toLowerCase().includes(searchKey?.toLowerCase());
      });
    }
  }

  const startNewChat = async (uid: any) => {
    const res: any = await createNewChat([currentUser._id, uid]);
    if (res.success) {
      const newChat = res.data;
      const updatedChat = [...allChats, newChat]
      dispatch(setAllChats(updatedChat));
      dispatch(setSelectedChat(newChat));
    }
  }

  const openChat = (uid: any) => {
    const chat = allChats.find((chat: any) => chat.members.map((m: any) => m._id).includes(currentUser._id) && chat.members.map((m: any) => m._id).includes(uid));

    console.log(chat)

    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  }

  const isSelectedUser = (uid: any) => {
    if (selectedChat) {
      return selectedChat.members.map((m: any) => m._id).includes(uid);
    }
    return false;
  }

  const getLastMessage = (uid: any) => {
    const chat = allChats.find((chat: any) => chat.members.map((m: any) => m._id).includes(uid));

    if (chat && chat.lastMessage) {
      const preFix = (chat?.lastMessage.sender === currentUser._id) ? "You: " : ''
      return `${preFix} ${chat?.lastMessage?.text?.substring(0, 25)}`;
    } else {
      return "";
    }
  }

  const getLastMessageTimestamp = (uid: any) => {
    const chat = allChats.find((chat: any) => chat.members.map((m: any) => m._id).includes(uid));

    if (chat && chat.lastMessage) {
      return moment(chat.lastMessage.createdAt).format('hh:mm A');
    } else {
      return "";
    }
  }

  const getUnreadMessageCount = (uid: any) => {
    const chat = allChats.find((chat: any) => chat.members.map((m: any) => m._id).includes(uid));

    // unread message count should only be visible to receiver not sender
    if (chat && chat?.unreadMessageCount && chat?.lastMessage?.sender !== currentUser._id) {
      return <div className="unread-message-counter"> {chat.unreadMessageCount} </div>;
    }
    else {
      return "";
    }
  }

  useEffect(() => {
    socket.off('set-msg-count').on('set-msg-count', (message: IMessage) => {
      const allChats = store.getState().userReducer.allChats as IChat[] | null;
      const selectedChat = store.getState().userReducer.selectedChat as IChat | null;

      if (selectedChat?._id !== message.chatId) {
        const updatedChats = allChats?.map((chat: IChat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              unreadMessageCount: (chat?.unreadMessageCount || 0) + 1,
              lastMessage: message
            }
          }
          return chat
        })
        dispatch(setAllChats(updatedChats));
      }
    })
  }, [])


  return (
    getData()
      .map((userObj: any) => {
        let user = userObj;
        if (userObj.members) {
          user = userObj.members.find((mem: any) => mem._id !== currentUser._id);
        }
        console.log(user);
        const name: string = `${user?.firstName} ${user?.lastName}`;
        return (
          <Fragment key={user._id}>
            <div className="user-search-filter" onClick={() => openChat(user._id)}>
              <div className={isSelectedUser(user._id) ? "selected-user" : "filtered-user"}>
                <div className="filter-user-display">
                  {/* <!-- <img src={user.profilePic} alt="Profile Pic" className="user-profile-image"> --> */}
                  <div className="user-default-profile-pic">
                    {getInitials(name)}
                  </div>
                  <div className="filter-user-details">
                    <div className="user-display-name">{getFullName(name)}</div>
                    <div className="user-display-email">{getLastMessage(user._id) || user?.email}</div>
                  </div>
                  <div>
                    {getUnreadMessageCount(user._id)}
                    <div className="last-message-timestamp">{getLastMessageTimestamp(user._id)}</div>
                  </div>
                  <div className="user-start-chat">
                    {!allChats.find((chat: any) => chat.members.map((m: any) => m._id).includes(user._id)) && <button className="user-start-chat-btn" onClick={() => startNewChat(user._id)}>Start Chat</button>}
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        )
      })
  )
}

export default UsersList