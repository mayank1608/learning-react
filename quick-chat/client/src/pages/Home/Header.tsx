import { useDispatch, useSelector } from 'react-redux';
import { getInitials, getFullName } from '../../utils/utilities';
import { useNavigate } from 'react-router';
import Cookies from "js-cookie";
import { setAllChats, setAllUsers, setSelectedChat, setUser } from '../../redux/usersSlice';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.userReducer);
    const name: string = `${user?.firstName} ${user?.lastName}`;
    const logout = () => {
        Cookies.remove('token');
        // clearing all reducer states - setUser(null), setAllUsers([]), setAllChats([]), setSelectedChat(null)
        dispatch(setUser(null));
        dispatch(setAllUsers([]));
        dispatch(setAllChats([]));
        dispatch(setSelectedChat(null));
        navigate('/login');

        // socket.emit('user-offline', user._id);
    }
    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true"></i>
                Lets Chat
            </div>
            <div className="app-user-profile">
                <div className="logged-user-name">{getFullName(name)}</div>
                {user?.profilePic &&
                    <img
                        src={user?.profilePic}
                        alt="profile-pic"
                        className="logged-user-profile-pic"
                        onClick={() => navigate('/profile')}>
                    </img>
                }
                {!user?.profilePic &&
                    <div
                        className="logged-user-profile-pic"
                        onClick={() => navigate('/profile')}>
                        {getInitials(name)}
                    </div>
                }
                <button className="logout-button" onClick={logout}>
                    <i className="fa fa-power-off"></i>
                </button>

            </div>
        </div>
    )
}

export default Header