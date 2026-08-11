

import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './components/home'
import About from './components/about'
import Forms from './components/forms'
import NavBar from './components/navbar'

function App() {


  return (
    <div>    
                <BrowserRouter>
                 <NavBar/>            

                 
            </BrowserRouter>

            <BrowserRouter>
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/forms" element={<Forms />} />                    
                </Routes>
            </BrowserRouter>

            

      
</div>
   
  )
}

export default App
