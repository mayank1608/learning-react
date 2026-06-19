import { useSelector } from 'react-redux';
import './Profile.css';
import { formatDate, getInitials, getFullName } from '../utils/utilities';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Profile = () => {
    useDocumentTitle("Profile | Quick Chat");
    const { user } = useSelector((state: any) => state.userReducer);
    const name: string = `${user?.firstName} ${user?.lastName}`;
    return (
        <>
            <title>Profile | Quick Chat</title>
            <div className="profile-page-container">
                <div className="profile-pic-container">
                    {/* <img src="quick-chat-app-background.jpg" 
                 alt="Profile Pic" 
                 className="user-profile-pic-upload" 
            />  */}
                    <div className="user-default-profile-avatar">
                        {getInitials(name)}
                    </div>
                </div>

                <div className="profile-info-container">
                    <div className="user-profile-name">
                        <h1>{getFullName(name)}</h1>
                    </div>
                    <div>
                        <b>Email: </b>{user?.email}
                    </div>
                    <div>
                        <b>Account Created: </b>{formatDate(user?.createdAt)}
                    </div>
                    <div className="select-profile-pic-container">
                        <input type="file" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile