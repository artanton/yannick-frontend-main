import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CustomProgressBars from '../CustomProgressBar/CustomProgressBars';
import CustomProgress from '../CustomProgress/CustomProgress';
import CircularProgress from '@mui/material/CircularProgress';
import * as AuthApi from '../../api/auth.api';
import useNotificationStore from '../../stores/notification.store';
import { NotificationBadge } from '../Notification/Notification';
import { useNavigate } from 'react-router-dom';
import show from '../../assets/images/Show.svg'
import hide from '../../assets/images/Hide.svg'
import BackIcon from '../../assets/images/BackIcon.svg';
import './SignUp.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';


// const countryCodes = require('country-codes-list')

// const countryCodesList = countryCodes.customList('countryCode', '[{countryCode}] {countryNameEn}: +{countryCallingCode}')


const countryCodesList = [
    '[US] United States: +1',
    '[CA] Canada: +1',
    '[IN] India: +91',
    '[GB] United Kingdom: +44',
    '[AU] Australia: +61',
    '[FR] France: +33'
];

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

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState('+44');
    const [isLoading, setIsLoading] = useState(false);
    const { notificationBadge, setNotificationBadge } = useNotificationStore(state => ({
        notificationBadge: state.notificationBadge,
        setNotificationBadge: state.setNotificationBadge
    }));
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const passwordStrength = formData?.password ? calculatePasswordStrength(formData?.password) : 0;
    const calculateProgress = () => {
        let progress = 0;
        if (formData?.name) progress += 16.67;
        if (formData?.surname) progress += 16.67;
        if (formData?.phoneNumber) progress += 16.67;
        if (formData?.email) progress += 16.67;
        if (formData?.password) progress += 16.67;
        if (formData?.confirmPassword) progress += 16.67;
        return progress;

    };
    const handleCountryCodeChange = (event) => {
        const countryCode = event.target.value;
        setSelectedCountryCode(countryCode);
        setFormData((prevFormData) => ({
            ...prevFormData,
            phoneNumber: `${countryCode}${prevFormData.phoneNumber.replace(selectedCountryCode, '')}`
        }));
    };
    const calculatePasswordProgress = () => {
        if (formData?.password.length >= 8) {
            return 100;
        }
        return (formData?.password.length / 8) * 100;
    };
   
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phoneNumber') {
          const phoneNumberWithoutCode = value.replace(/^\+\d+/, '');
          const fullPhoneNumber = `${selectedCountryCode}${phoneNumberWithoutCode}`;
          const phoneNumberObject = parsePhoneNumberFromString(fullPhoneNumber);
          if (phoneNumberObject && phoneNumberObject.isValid()) {
           
            setFormData((prevFormData) => ({
              ...prevFormData,
              phoneNumber: fullPhoneNumber
            }));
            setErrorMessage('');
          } else {
            
            setFormData((prevFormData) => ({
              ...prevFormData,
              phoneNumber: fullPhoneNumber
            }));
            setErrorMessage('Invalid phone number format.');
          }
        } else {
          
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value || ''
          }));
          setErrorMessage('');
        }
      };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickConformPassword = () => setConfirmPassword(!showConfirmPassword);
    const validateForm = () => {
        let valid = true;
        const newErrors = { password: '', confirmPassword: '' };


        if (formData?.password.length > 0 && formData?.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
            valid = false;
        }

        if (formData?.confirmPassword.length > 0 && formData?.password !== formData?.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
            valid = false;
        }
        


        setErrors(newErrors);
        return Object.values(formData).every((value) => value.trim() !== '');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name,surname,email, phoneNumber,password,confirmPassword } = formData;
        let allrequiredFieldsError = '';
        if (!name || !surname || !email || !phoneNumber || !password || !confirmPassword) {
            allrequiredFieldsError = 'All fields are required.';
            
          }
          if (allrequiredFieldsError) {
            setNotificationBadge({
              showNotification: true,
              isSuccess: false,
              message: allrequiredFieldsError
            });
            return;
          }
        if (validateForm()) {
            setIsLoading(true);
            const data = {
                username: `${formData.name.trim()}${formData.surname.trim()}`,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber
            };
            console.log("user data", data)

            try {

                const res = await AuthApi.registerUser(data);
                console.log("response", res)

                if (res && res.accessToken) {
                    localStorage.setItem("access_token", res.accessToken);
                    localStorage.setItem("email", res.user.email);

                    setNotificationBadge({
                        showNotification: true,
                        isSuccess: true,
                        message: res?.message
                    });

                    navigate('/payment');
                    setFormData({
                        name: '',
                        surname: '',
                        phoneNumber: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    });
                } else {
                    setNotificationBadge({
                        showNotification: true,
                        isSuccess: false,
                        // message: res?.response?.data?.message || "Something went wrong during registration!"
                        message: res?.error?.response.data
                    });
                }

            } catch (error) {

                setErrors({ form: 'Registration failed. Please check your details and try again.' });
            } finally {
                setIsLoading(false);
            }
        }
    };
    const handleBackClick = () => {
        navigate('/subscription');
    };
    useEffect(() => {
        const formIsValid = validateForm();
        setIsFormValid(formIsValid);
    }, [formData]);



    return (
        <>
            {notificationBadge?.showNotification && <NotificationBadge notificationBadge={notificationBadge} setNotificationBadge={setNotificationBadge} />}
            <div className='signup-main'>
                <Row className='upper-content p-0'>
                    <div className="upper-progress ">
                        <div className="backbtn" onClick={handleBackClick} style={{ cursor: "pointer" }} >
                            <img src={BackIcon} alt="" />
                        </div>
                        <CustomProgressBars
                            progress1={100}
                            progress2={calculateProgress()}
                            progress3={0}

                        />
                    </div>
                    <div className="sign-up-heading">
                        <h2 className='text-white'>Create your account</h2>
                        <p className='text-white'>Fill in your details to get started and access exclusive features.</p>
                    </div>

                </Row>
                <Row className='mb-3 p-0'>

                    <Form onSubmit={handleSubmit}>
                        <div className="inputs">
                            <Form.Group className="formdata " controlId="formBasicName">
                                <Form.Label className='text-white'>Enter Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </Form.Group>

                            <Form.Group className="formdata" controlId="formBasicSurname">
                                <Form.Label className='text-white'>Surname</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter surname"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </Form.Group>
                            <Form.Group className="formdata" controlId="formBasicPhoneNumber" >
                                <Form.Label className='text-white'>Phone number</Form.Label>
                                <div className="phone-number-container" style={{border: errorMessage ? '1px solid #C60000' : ''}}>
                                    <Form.Control
                                        as="select"
                                        className="phone-number-select"
                                        value={selectedCountryCode}
                                        onChange={handleCountryCodeChange}
                                        disabled={isLoading}
                                        style={{border:"none",color:"#A7AEB7",}}
                                    >
                                        {Object.entries(countryCodesList).map(([code, name]) => {
                                            const match = name.match(/\+(\d+)/);
                                            const numericCode = match ? match[0] : '';
                                            return (
                                                <option key={code} value={numericCode} style={{ color: "#A7AEB7" }}>
                                                    {numericCode}
                                                </option>
                                            );
                                        })}
                                    </Form.Control>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone number"
                                        name="phoneNumber"
                                        value={formData.phoneNumber.replace(selectedCountryCode, '')} // Display phone number without the country code in the input field
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="phone-number-input"
                                        style={{paddingLeft:'59px',}}
                                        
                                    />
                                </div>
                               
                                {errorMessage &&
                                        <div className='error_msg' style={{ maxWidth: "197px" }}> <Form.Text className="text-danger">{errorMessage}</Form.Text></div>}
                            </Form.Group>


                            <Form.Group className="formdata" controlId="formBasicEmail">
                                <Form.Label className='text-white'>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </Form.Group>
                            <div className="passcontainer">
                                <Form.Group className="formdata" controlId="formBasicPassword">
                                    <Form.Label className="text-white">Password</Form.Label>
                                    <div style={{ position: 'relative' }}>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            style={{ border: errors.password ? '1px solid #C60000' : '' }}
                                            disabled={isLoading}
                                        />
                                        <span
                                            onClick={handleClickShowPassword}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {showPassword ? <img src={hide} alt="show" /> : <img src={show} alt="hide" />}
                                        </span>
                                    </div>
                                    {errors.password &&
                                        <div className='error_msg'> <Form.Text className="text-danger">{errors.password}</Form.Text></div>}


                                </Form.Group>

                                <Form.Group className="formdata" controlId="formConfirmPassword">
                                    <Form.Label className='text-white'>Confirm password</Form.Label>
                                    <div style={{ position: 'relative' }}>
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            style={{ border: errors.confirmPassword ? '1px solid #C60000' : '' }}
                                            disabled={isLoading}
                                        />
                                        <span
                                            onClick={handleClickConformPassword}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {showConfirmPassword ? <img src={hide} alt="show" /> : <img src={show} alt="hide" />}
                                        </span>
                                    </div>
                                    {errors.confirmPassword &&
                                        <div className='error_msg' style={{ maxWidth: "167px" }}> <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>
                                        </div>}

                                </Form.Group>
                                <div className="passwordlength">
                                    <CustomProgress progress={calculatePasswordProgress()} />
                                    <div className="passwordlengthtext">
                                        <span>
                                            Password strength: <strong>{getStrengthLabel(passwordStrength)}</strong>
                                        </span>

                                        <span>At least 8 characters</span>
                                    </div>
                                </div>
                            </div>


                            <button className='continue-sign-up'
                                style={{
                                    backgroundColor: isFormValid ? '#63ECFC' : '#B6F9FF',
                                    color: isFormValid ? '#1D6169' : '#A5C2C5',
                                }}
                                type="submit">{isLoading ? <CircularProgress size={24} /> : 'Continue'}</button>
                        </div>
                    </Form>

                </Row>

            </div>
        </>
    );
}

export default SignUp;
