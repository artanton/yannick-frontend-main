import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import * as AuthApi from "../../api/auth.api";
// Make sure this is the correct path to your API functions
import logo from '../../assets/images/logo.svg';
import './CreatePassword.css';
import show from '../../assets/images/Show.svg';
import hide from '../../assets/images/Hide.svg';
import CustomProgress from '../CustomProgress/CustomProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { NotificationBadge } from "../Notification/Notification";

const CreatePassword = () => {
    const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: ''
    });

    const [notificationBadge, setNotificationBadge] = useState({
        showNotification: false,
        isSuccess: false,
        message: ''
    });

    const location = useLocation();
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickConformPassword = () => setshowConfirmPassword(!showConfirmPassword);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setToken(params.get('t'));
    }, [location.search]);

    const calculatePasswordStrength = (password) => {
        const lengthCriteria = password.length >= 8;
        const uppercaseCriteria = /[A-Z]/.test(password);
        const numberCriteria = /\d/.test(password);
        const specialCharCriteria = /[!@#$%^&*]/.test(password);

        let strength = 0;
        if (lengthCriteria) strength += 25;
        if (uppercaseCriteria) strength += 25;
        if (numberCriteria) strength += 25;
        if (specialCharCriteria) strength += 25;

        return strength;
    };

    const getStrengthLabel = (strength) => {
        if (strength < 50) return 'Weak';
        if (strength < 75) return 'Medium';
        if (strength < 100) return 'Strong';
        return ' Strong';
    };
    const passwordStrength = formData?.password ? calculatePasswordStrength(formData?.password) : 0;

    // Validate the password length
    const validatePassword = (password) => {
        if (password.length > 0 && password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        return '';
    };

    // Validate if confirm password matches the password
    const validateConfirmPassword = (confirmPassword) => {
        if (formData.password !== confirmPassword) {
            return 'Passwords do not match.';
        }
        return '';
    };

    const calculatePasswordProgress = () => {
        if (formData?.password.length >= 8) {
            return 100;
        }
        return (formData?.password.length / 8) * 100;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Run validation for the specific field
        if (name === 'password') {
            setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
        } else if (name === 'confirmPassword') {
            setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
        }

        // Check if password and confirmPassword match and update password state
        if (
            (name === 'password' && value === formData.confirmPassword) ||
            (name === 'confirmPassword' && value === formData.password)
        ) {
            setPassword(value); // Set the password state
        } else {
            setPassword(''); // Clear the password state if they don't match
        }
    };

    const validateForm = () => {
        const newErrors = {
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
        };

        setErrors(newErrors);

        // Check if all form values are non-empty and no validation errors
        return Object.values(formData).every((value) => value.trim() !== '') &&
            Object.values(newErrors).every((error) => error === '');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setError('');
        setLoader(true);
        try {
            console.log("Password reset", token, password)
            const response = await AuthApi.resetPassword({ token, password });
            console.log('resetPassword response', response);

            if (response.status) {
                setNotificationBadge({
                    showNotification: true,
                    isSuccess: true,
                    message: 'Password reset successfully!',
                });

                setLoader(false);
                setPasswordResetSuccess(true);
            } else {
                setNotificationBadge({
                    showNotification: true,
                    isSuccess: false,
                    message: response?.message || 'Failed to reset password',
                });
            }
        } catch (error) {
            setError(error.response?.data.message || 'An error occurred');
        } finally {
            setLoader(false);
        }


    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (


        <div className="create-password-container">
            {passwordResetSuccess ? (
                <div style={{ gap: "80px", display: "flex", flexDirection: "column" }} >
                    <div className="create-pass-logo">
                        <img src={logo} alt="Changecurve AI Logo" />
                    </div>
                    <div className="changed-pasword-page">
                        <div className="changed-pass-heading">
                            <h1>Password successfully changed</h1>
                            <p>You can now <Link className='redirect-login' to="/login">Sign In</Link> in with your new password.</p>
                        </div>
                        <button className="changed-password" onClick={handleLoginRedirect}>
                            Sign In
                        </button>
                    </div>
                </div>
            ) : (
                <div className="create-container">
                    <div className="create-pass-logo">
                        <img src={logo} alt="Changecurve AI Logo" />
                    </div>

                    <div className="create-pass-heading">
                        <h2>Create new password</h2>
                        <p>Please enter your new password below.</p>
                    </div>

                    <form className="create-form-data" onSubmit={handleResetPassword}>
                        <div>

                            <div className="create-pass-form-input" style={{ position: 'relative' }}>
                                <label htmlFor="password">New password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                                    }}
                                >
                                    {showPassword ? <img src={hide} alt="show" /> : <img src={show} alt="hide" />}
                                </span>

                            </div>
                            {errors.password &&
                                <div className='error-message' style={{ maxWidth: "296px" }}> <span>{errors.password} </span></div>}
                        </div>
                        <div>
                            <div className="create-pass-form-input" style={{ position: 'relative' }}>
                                <label htmlFor="confirmPassword">Confirm password</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{ border: errors.confirmPassword ? '1px solid #C60000' : '' }}
                                />
                                <span
                                    onClick={handleClickConformPassword}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '65%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showConfirmPassword ? <img src={hide} alt="show" /> : <img src={show} alt="hide" />}
                                </span>

                            </div>
                            {errors.confirmPassword &&
                                <div className='error-message'> <span>{errors.confirmPassword} </span></div>}
                        </div>

                        <div className="passwordlength">
                            <CustomProgress progress={calculatePasswordProgress()} />
                            <div className="passwordlengthtext">
                                <span>
                                    Password strength: <strong>{getStrengthLabel(passwordStrength)}</strong>

                                </span>
                                <span>At least 8 characters</span>
                            </div>
                        </div>
                        <button type="submit" className="create-pass-button" style={{
                            backgroundColor: password ? '#63ECFC' : '#B6F9FF',
                            color: password ? '#1D6169' : '#A5C2C5',
                        }} >
                            {/* {loader ? <CircularProgress size={24} /> && 'Saving...' : 'Save password'} */}
                            {loader ? (
                                <div className='d-flex justify-content-center align-items-center'>
                                    <CircularProgress size={20} style={{ marginRight: '10px' }} />
                                    Saving...
                                </div>
                            ) : (
                                'Save password'
                            )}


                        </button>
                    </form>

                    {notificationBadge.showNotification && (

                        <NotificationBadge
                            notificationBadge={notificationBadge}
                            setNotificationBadge={setNotificationBadge}
                        />

                    )}
                </div>
            )}
        </div>

    );
};

export default CreatePassword;

