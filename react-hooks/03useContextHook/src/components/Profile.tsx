import {useContext} from 'react'
import {UserContext} from '../contexts/userContext'

function Profile() {
    const {user}:any = useContext(UserContext)
    
    if (!user) return <div>please login</div>

    return <div>Welcome {user.username}</div>
}

export default Profile