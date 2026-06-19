import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './Register.css';
import { login } from '../services/authApi';
import Cookies from "js-cookie";
import useDocumentTitle from '../hooks/useDocumentTitle';

const Login = () => {
    useDocumentTitle("Login | Quick Chat");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const onChangerHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmitHandler = async (event: React.ChangeEvent) => {
        event.preventDefault();
        try {
            const res: any = await login(formData);
            if (res.success) {
                Cookies.set('token', res.token);
                localStorage.setItem('token', res.token);
                navigate('/');
            }

        } catch (error: any) {
            console.log(error.message)
        }
    }
    return (
        <div className="container">
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
                <div className="card_title">
                    <h1>Login Here</h1>
                </div>
                <div className="form">
                    <form onSubmit={onSubmitHandler}>
                        <input type="email" placeholder="Email" name='email' value={formData.email} onChange={onChangerHandler} />
                        <input type="password" placeholder="Password" name='password' value={formData.password} onChange={onChangerHandler} />
                        <button>Login</button>
                    </form>
                </div>
                <div className="card_terms">
                    <span>Don't have an account yet?
                        <Link to="/register">Signup Here</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Login