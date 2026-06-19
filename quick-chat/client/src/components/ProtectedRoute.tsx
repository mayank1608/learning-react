import { useEffect, type ReactNode } from 'react'
import { getAllUsers, getProfile } from '../services/userApi';
import Cookies from "js-cookie";
import { setAllChats, setAllUsers, setUser } from '../redux/usersSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { getAllChats } from '../services/chatApi';

type Props = {
    children: ReactNode;
};


const ProtectedRoute = ({ children }: Props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getloggedInUserProfile = async () => {
        try {
            const res: any = await getProfile();
            if (res.success) {
                dispatch(setUser(res.data))
            } else {
                window.location.href = '/login';
            }
        } catch (error) {
            navigate('/login');
        }
    }

    const getAllUsersFromDb = async () => {
        try {
            const res: any = await getAllUsers();

            if (res.success) {
                dispatch(setAllUsers(res.data));
            } else {
                // toast.error(res.message);
                window.location.href = '/login';
            }
        } catch (error) {
            navigate('/login');
        }
    }

    const getCurrentUserChats = async () => {
        try{
            const res: any = await getAllChats();
            if(res.success){
                dispatch(setAllChats(res.data))
            }
        }catch(error){
            navigate('/login');
        }
    }

    useEffect(() => {
        if (Cookies.get('token')) {
            getloggedInUserProfile();
            getAllUsersFromDb();
            getCurrentUserChats();
        } else {
            navigate('/login');
        }
    }, [])


    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute