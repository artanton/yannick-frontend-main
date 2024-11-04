import React, { useState, useEffect } from 'react';
import './SignIn.css';
import logo from '../../assets/images/logo.svg';
import * as AuthApi from '../../api/auth.api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import useNotificationStore from '../../stores/notification.store';
import { NotificationBadge } from '../Notification/Notification';
import show from '../../assets/images/Show.svg'
import hide from '../../assets/images/Hide.svg'
import { Link } from 'react-router-dom';
localStorage.removeItem('email');
const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const { notificationBadge, setNotificationBadge } = useNotificationStore(state => ({
        notificationBadge: state.notificationBadge,
        setNotificationBadge: state.setNotificationBadge
    }));

    const handleEmailChange = (e) => {
        setEmail(e.target.value);

        if (errors.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);

        if (errors.password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Field is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (!password) {
            newErrors.password = 'Field is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setEmail("")
        setPassword("")
    }

    // useEffect(() => {
    //     const savedEmail = localStorage.getItem('rememberedEmail');
    //     const savedPassword = localStorage.getItem('rememberedPassword');
    //     const rememberMeStatus = localStorage.getItem('rememberMe') === 'true';

    //     if (savedEmail && rememberMeStatus) {
    //         setEmail(savedEmail);
    //         setRememberMe(true);
    //         console.log("rember me click ",rememberMe)
    //     }

    //     if (savedPassword && rememberMeStatus) {
    //         setPassword(savedPassword);
    //     }
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {


            setIsLoading(true);
            try {
                const res = await AuthApi.login({ email, password });
                if (res?.accessToken) {
                    localStorage.setItem("access_token", res?.accessToken)

                    localStorage.setItem("email", email)

                
                    // if (rememberMe) {rememberMe
                    //     // Save credentials if "Remember Me" is checked
                    //     localStorage.setItem('rememberedEmail', email);
                    //     localStorage.setItem('rememberedPassword', password);
                    //     localStorage.setItem('rememberMe', true);
                    // } else {
                    //     // Clear remembered credentials if not checked
                    //     localStorage.removeItem('rememberedEmail');
                    //     localStorage.removeItem('rememberedPassword');
                    //     localStorage.removeItem('rememberMe');
                    // }

                    navigate('/my-plans');
                } else {
                    setNotificationBadge({ showNotification: true, isSuccess: false, message: res?.message || "Something went wrong !!" })
                }
                resetForm()
            } catch (error) {
                setErrors({ form: 'Login failed. Please check your credentials and try agrememberMeain.' });
            } finally {
                setIsLoading(false);
                resetForm()
            }
        }
    };

    useEffect(() => {
        setIsFormValid(email !== '' && password !== '' && Object.keys(errors).length === 0);
    }, [email, password, errors]);



    return (
        <>
            {notificationBadge?.showNotification && <NotificationBadge notificationBadge={notificationBadge} setNotificationBadge={setNotificationBadge} />}
            <div className="sign-in-container">

                <div className="sign-in-logo">
                    <img src={logo} alt="Changecurve AI Logo" />
                </div>

                <div className="welcome-container">
                    <div className='sign-in-heading'>
                        <h2>Welcome to Changecurve AI!</h2>
                        {/* <p>Don’t have an account? <a href="/signup">Sign up</a></p> */}
                        <p>Don’t have an account? <Link className='redirect-login' to="/subscription">Sign up</Link></p>
                    </div>
                    <form className="sign-in-form" onSubmit={handleSubmit}>

                        <div className='sign-in-inputs'>
                            <div className="sign-in-input">
                                <div className='text-input d-flex flex-column'>
                                    <label htmlFor="email">Email</label>

                                    <input
                                        id="email"
                                        className="email-input-box"
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        disabled={isLoading}
                                        style={{ border: errors.email ? '1px solid #C60000' : '' }}
                                    />
                                </div>
                                {errors.email &&
                                    <div className='error-mgs'>
                                        <span >{errors.email}</span>
                                    </div>
                                }

                            </div>
                            <div className="sign-in-input" >

                                <div className='text-input d-flex flex-column' style={{ position: 'relative' }}>
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        className="password-input-box"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        disabled={isLoading}
                                        style={{ border: errors.password ? '1px solid #C60000' : '' }}
                                    />
                                    <span
                                        onClick={handleClickShowPassword}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '65%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            color: '#4D777C'

                                        }}
                                    >
                                        {showPassword ? <img src={hide} alt="show" /> : <img src={show} alt="hide" />}
                                    </span>
                                </div>
                                {errors.password &&
                                    <div className='error-mgs'>
                                        <span >{errors.password}</span>
                                    </div>
                                }



                            </div>
                            <div className="form-options">
                                <div className="remember-me-container">
                                    <input
                                        type="checkbox"
                                        className="remember-me-checkbox"
                                       
                                         checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={isLoading}
                                    />
                                    <span className="remember-me-label">Remember me</span>
                                </div>
                                <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                            </div>
                        </div>



                        <button
                            type="submit"
                            className="sign-in-button"
                            style={{
                                backgroundColor: isFormValid ? '#63ECFC' : '#B6F9FF',
                                color: isFormValid ? '#1D6169' : '#A5C2C5',
                            }}
                        // disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                        </button>
                        {errors.form && <div className="error-message">{errors.form}</div>}
                    </form>
                </div>



            </div>
        </>
    );
}

export default SignIn;
