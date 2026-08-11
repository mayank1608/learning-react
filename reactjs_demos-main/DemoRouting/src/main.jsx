import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home.jsx'
import Contact from './components/Contact.jsx'
import Forms from './components/Forms.jsx'
import About from './components/About.jsx'
import  Navbar from './components/Navbar.jsx'


const myRouter=createBrowserRouter([
  {
    path:"/",
    element:<Navbar/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/home",
        element:<Home/>
      },
      {
        path:"/about",
        element:<About/>
      },
      {
        path:"/forms",
        element:<Forms/>
      },
      {
        path:"/contact",
        element:<Contact/>
      }
    ]
  }
])
  

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={myRouter} />
  </StrictMode>,
)
