import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import './ForgotPassword.css';
import CircularProgress from '@mui/material/CircularProgress';
import { NotificationBadge } from "../Notification/Notification";
import * as AuthApi from "../../api/auth.api";


function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const navigate = useNavigate();
    const [notificationBadge, setNotificationBadge] = useState({
        showNotification: false,
        isSuccess: null,
        message: "",
    });
//    Set Count Down 
    useEffect(() => {
        let timer;
        if (countdown > 0 && isButtonDisabled) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            // Redirect after countdown reaches 0
            navigate('/login'); 
        }

        return () => clearInterval(timer);
    }, [countdown, isButtonDisabled, navigate]);

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        const isValid = validateEmail(value);
        setIsFormValid(isValid);
        setError(isValid ? '' : 'Please enter a valid email address.');
    };

    const sendLinkAgain = async (e) => {
        try {
            let email = localStorage.getItem('email');
            const response = await AuthApi.forgotPassword({ email });
            console.log('sendPasswordRecoveryEmail', response);
            if (response.status) {
                setNotificationBadge({
                    showNotification: true,
                    isSuccess: true,
                    message: response?.message,
                });
                // setResetEmail(true);
                setIsButtonDisabled(true);
                setCountdown(10);

            } else {
                setNotificationBadge({
                    showNotification: true,
                    isSuccess: false,
                    message: response?.message
                });
            }


        } catch (error) {
            console.error('Error sending password recovery email:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setError('Please enter a valid email address.');
            return;
        }

        try {

            setIsLoading(true);

            localStorage.setItem('email', email);

            await sendPasswordRecoveryEmail(email);
            setSuccessMessage(`We have sent a link to reset your password to ${email}.`);
            setEmailSent(true);
            setEmail('');
            setIsFormValid(false);
        } catch (error) {
            setError('There was a problem sending the email. Please try again later.');
        }
    };

    const sendPasswordRecoveryEmail = async (email) => {
        try {
            const response = await AuthApi.forgotPassword({ email });
            console.log('sendPasswordRecoveryEmail', response);
            if (response.status) {
                setNotificationBadge({
                    showNotification: true,
                    isSuccess: true,
                    message: response?.message,
                });

                // setTimeout(() => {
                //     setNotificationBadge({ showNotification: false });
                //     window.location.href = '/login';
                // }, 4000);


            } else {
                setNotificationBadge({
                    showNotification: true,
                    isSuccess: false,
                    message: response?.message
                });
            }
        } catch (error) {
            console.error('Error sending password recovery email:', error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };



    return (

        <div className="forgot-container">

            {notificationBadge?.showNotification && <NotificationBadge notificationBadge={notificationBadge} setNotificationBadge={setNotificationBadge} />}

            <div className="forgot-logo">
                <img src={logo} alt="Changecurve AI Logo" />
            </div>
            <div className="forgot-container-inner">
                {!emailSent ? (
                    <>
                        <div className='forgot-title'>
                            <h2>Password recovery</h2>
                            <p>Please provide your email address.<br />We will send you a link to reset your password.</p>
                        </div>
                        <form className="forgot-inputs">
                            <div className="forgot-email">
                                <div className="email-label-container">
                                    <label htmlFor="email">Email</label>
                                </div>
                                <input
                                    id="email"
                                    className={`email-input-box ${error ? 'error' : ''}`}
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    style={{ border: error.email ? '1px solid #C60000' : '' }}
                                />
                                {error && <div className="error-message"><span>{error}</span></div>}
                            </div>

                        </form>
                        <button
                            type="submit"
                            className="forget-button"
                            style={{
                                backgroundColor: isFormValid ? '#63ECFC' : '#B6F9FF',
                                color: isFormValid ? '#1D6169' : '#A5C2C5',
                            }}
                            onClick={handleSubmit}
                        >
                            {isLoading ? (


                                <div className='d-flex justify-content-center align-items-center'>
                                    <CircularProgress size={20} style={{ marginRight: '8px' }} />
                                    Email is being sent...
                                </div>

                            ) : (
                                'Send link'


                            )}


                        </button>

                    </>
                ) : (
                    <>
                        <div className='forgot-title'>
                            <h2>Password recovery</h2>
                            <p>{successMessage}</p>
                        </div>

                        <button
                            type="submit"
                            className="forget-button"
                            onClick={sendLinkAgain}
                            disabled={isButtonDisabled}
                            style={{
                                backgroundColor: '#63ECFC',
                                color: '#1D6169',
                            }}
                        >
                            {/* {emailSent ? 'Resend' : 'Send link'} */}
                            {isButtonDisabled ? `Redirect login in ${countdown}s` : 'Resend'}

                        </button>
                    </>
                )}

            </div>
        </div>

    );
}

export default ForgotPassword;

