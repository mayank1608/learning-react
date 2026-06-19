import React, { useState } from 'react';
import './Register.css';
import { register } from '../services/authApi';
import { Link } from 'react-router';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const onChangerHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event?.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmitHandler = async (event: React.ChangeEvent) => {
        event.preventDefault();
        try {
           const res:any =  await register(formData);
           console.log(res);            
        } catch (error: any) {
            console.log(error.message)
        }
    }
    
    return (
        <div className="container">
            <title>Register | Quick Chat</title>
            {/* <p>{JSON.stringify(formData)}</p> */}
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
                <div className="card_title">
                    <h1>Create Account</h1>
                </div>
                <div className="form">
                    <form onSubmit={onSubmitHandler}>
                        <div className="column">
                            <input type="text" placeholder="First Name" name='firstName' value={formData.firstName} onChange={onChangerHandler}/>
                            <input type="text" placeholder="Last Name" name='lastName' value={formData.lastName} onChange={onChangerHandler}/>
                        </div>
                        <input type="email" placeholder="Email" name='email' value={formData.email} onChange={onChangerHandler}/>
                        <input type="password" placeholder="Password" name='password' value={formData.password}onChange={onChangerHandler} />
                        <button>Sign Up</button>
                    </form>
                </div>
                <div className="card_terms">
                    <span>Already have an account?
                        <Link to="/login">Login Here</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Register