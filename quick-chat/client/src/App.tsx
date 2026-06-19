import { BrowserRouter, Route, Routes } from 'react-router'
import { lazy, Suspense } from "react";
import './App.css'
import Loader from './components/Loader';
import Home from './pages/Home/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import { useSelector } from 'react-redux';
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));

const App = () => {
  const { loader } = useSelector((state: any) => state.loaderReducer)
  return (
    <>
      {loader && <Loader />}
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
