import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import CustomProgressBars from '../CustomProgressBar/CustomProgressBars';
import * as AuthApi from '../../api/auth.api';
import BackIcon from '../../assets/images/BackIcon.svg';
import { FaCheckCircle } from 'react-icons/fa'; // Import Font Awesome Icon
import { PLAN_CHARGE_AMOUNT } from '../../constants/constant'
import useUserStore from '../../stores/useUserStore';
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from '@stripe/react-stripe-js';
import flash from '../../assets/images/flash.svg';
import { Spinner, Modal, Button } from 'react-bootstrap'; // Import Modal and Button
import './Payment.css';

const Payment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const {fetchUserData,user}=useUserStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control modal visibility
    const [progress, setProgress] = useState(0);
    const [isFormValid, setIsFormValid] = useState(false);
    const [errors, setErrors] = useState({ cardName: '' });
    const ELEMENT_OPTIONS = {
        style: {
            base: {
                fontSize: '16px',
                color: '#1D6169',
                '::placeholder': {
                    color: '#A7AEB7',
                    fontFamily: 'Fustat',
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '21px',
                    textAlign: 'left',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };
 useEffect(()=>{
    fetchUserData()
 },[])

    // Initial state setup for form data
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardName: '',
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = { cardName: '' };

        // Retrieve cardName from formData
        const { cardName } = formData;

        // Check if cardName is required
        if (!cardName || cardName.trim() === '') {
            newErrors.cardName = 'Field is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };


    // Handling changes for regular input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value || ''
        }));

    };

    // Handling changes for Stripe elements
    const handleStripeElementChange = (elementType, event) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [elementType]: "filled" // Set value only when complete
        }));

    };
    const calculateProgress = () => {
        const totalFields = 4; // Total number of fields to track progress
        let filledFields = 0;

        // Check if each field is filled and increment counter accordingly
        if (formData.cardNumber) filledFields++;
        if (formData.expiryDate) filledFields++;
        if (formData.cvc) filledFields++;
        if (formData.cardName) filledFields++;

        // Calculate progress based on filled fields
        const progress = (filledFields / totalFields) * 100;
        return progress;
    };
    // Calculate progress whenever formData changes
    useEffect(() => {
        const updatedProgress = calculateProgress();
        setProgress(updatedProgress);
        if (updatedProgress > 75) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [formData]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (validateForm()) {
            setIsProcessing(true);
            try {
                const result = await AuthApi.createPaymentIntent({
                    amount: PLAN_CHARGE_AMOUNT,
                    currency: 'usd'
                });

                if (result.error) {
                    throw new Error(result.error);
                }

                const clientSecret = result.clientSecret;

                const cardElement = elements.getElement(CardNumberElement);

                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: document.getElementById('cardName').value,
                        },
                    },
                });

                if (error) {
                    setErrorMessage(error.message);
                } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                    setIsProcessing(false);
                    setShowSuccessModal(true); // Show success modal

                    setTimeout(() => {
                        navigate('/create-plan'); // Redirect after 3 seconds
                    }, 4000);
                }

            } catch (error) {
                setErrorMessage('Payment failed. Please try again.');
            } finally {
                setIsProcessing(false);
            }
        }



    };

    const handleBackClick = () => {
        navigate('/signup');
    };

    return (
        <>
            <div fluid className='main-payment'>

                <Row className='upper-content-payment'>
                    <div className="upper-progress" onClick={handleBackClick} style={{ cursor: "pointer" }}>
                        <div className="backbtn" >
                            <img src={BackIcon} alt="" />
                        </div>
                        <CustomProgressBars progress1={100} progress2={100} progress3={progress} />
                    </div>

                </Row>
                <Row>

                    <Form onSubmit={handleSubmit}>
                        <div className="payment-container">
                            <div className="payment-heading">
                                <h2 className='text-white'>Checkout</h2>
                                <p className='text-white'>Fill in your details to get started and access exclusive features.</p>
                            </div>
                            <div className="payment-pricing">
                                <div className="pricing-inner d-flex justify-content-between">
                                    <div className="supperAffordable">
                                        <div className="priceImg">
                                            <img src={flash} alt="Super Affordable Starter" />
                                        </div>
                                        <div className="priceText">
                                            <span>Super Affordable</span>
                                            <h6>Starter</h6>
                                        </div>
                                    </div>
                                    <div className="price-month">
                                        <div className="month-text">
                                            <span>Per month</span>
                                        </div>
                                        <h5>$29</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="payment-inputs">
                                <div className="inner-input">
                                    <div className="paymnetData">
                                        <div className="cardNum">
                                            <label htmlFor="cardNumber">Card Number</label>
                                            <CardNumberElement id="cardNumber" className='cardinput' options={ELEMENT_OPTIONS} onChange={(event) => handleStripeElementChange('cardNumber', event)} />
                                        </div>
                                        <div className="cardExpiry">
                                            <label htmlFor="cardExpiry">Expiry Date</label>
                                            <CardExpiryElement id="cardExpiry" className='cardinput' options={ELEMENT_OPTIONS} onChange={(event) => handleStripeElementChange('expiryDate', event)} />
                                        </div>
                                        <div className="cardCvc">
                                            <label htmlFor="cardCvc">CVC</label>
                                            <CardCvcElement id="cardCvc" className='cardinput' options={ELEMENT_OPTIONS} onChange={(event) => handleStripeElementChange('cvc', event)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="cardName">
                                    <label htmlFor="cardName">Name on card</label>
                                    <input type="text" id="cardName" name='cardName' placeholder='Enter name' onChange={handleChange} style={{ border: errors.cardName ? '1px solid #C60000' : '' }} />
                                    {errors.cardName && <div className='err-mgs-payment'><span >{errors.cardName}</span></div>}
                                </div>
                            </div>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            <button className='continue-payment' type="submit" style={{
                                backgroundColor: isFormValid ? '#63ECFC' : '#B6F9FF',
                                color: isFormValid ? '#1D6169' : '#A5C2C5',
                            }} disabled={isProcessing}>
                                {isProcessing ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    'Continue with card'
                                )}

                            </button>

                        </div>
                    </Form>

                </Row>
                {/* Success Modal */}
                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                    <Modal.Header closeButton className="justify-content-center">
                        <Modal.Title className="w-100 text-center">Payment Successful</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <FaCheckCircle size={80} color="#28a745" /> {/* Success Icon */}
                        <p className="mt-4">Your payment was successful!</p>
                    </Modal.Body>

                </Modal>
            </div>

        </>
    );
};

export default Payment;
