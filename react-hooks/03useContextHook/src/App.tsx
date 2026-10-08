import UserContextProvider from './contexts/userContext';
import './App.css'
import Login from './components/Login'
import Profile from './components/Profile'
import ThemeBtn from './components/ThemeBtn';

function App() {
  

  return (

    
    <UserContextProvider>
      <h3>React useContext Hook</h3>
      <ThemeBtn />
      
      <Login />
      <Profile />
    </UserContextProvider>
  )
}

export default App
