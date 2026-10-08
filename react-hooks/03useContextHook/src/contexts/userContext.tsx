import {createContext, ReactNode, useState} from 'react'

export interface IUser {
    username:string;
    password:string;
}

export interface IUserState {
    user:IUser;
    setUser:(value: IUser) => void;
}

export const UserContext = createContext<IUserState | null>(null);
const UserContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser>({username:'', password: ''});
    return(
        <UserContext.Provider value={{user, setUser}}>
        {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider