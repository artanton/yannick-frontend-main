
import React, { useState } from 'react';
import BackIcon from '../../assets/images/BackIcon.svg';
import flash from '../../assets/images/flash.svg';
import checkmark from '../../assets/images/Check.svg';
import CustomProgressBars from '../CustomProgressBar/CustomProgressBars';
import { useNavigate } from 'react-router-dom';

import SubCard from './SubCard/SubCard'
import './SubscriptionPlan.css'
const SubscriptionPlan = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({
    progress1: 0,
  });


  const handleNavigate = () => {

    setProgress({ progress1: 100 });


    console.log("progress1", 100);


    navigate('/signup');
  };

  const cardOneData1 = {
    planName: 'Trail Pack',
    planType: 'Free',
    price: 0,
    imageSrc: flash,
    features: [],
  };

  const cardOneData2 = {
    planName: 'Super Affordable',
    planType: 'Starter',
    price: 29,
    imageSrc: flash,
    features: [
      { icon: checkmark, text: 'All usernames (uncapped)' },
      { icon: checkmark, text: 'Unlimited Google removals' },
      { icon: checkmark, text: 'Unlimited At-source removals' },
      { icon: checkmark, text: 'Fully automatic' },
      { icon: checkmark, text: 'Advanced AI leak detection' },
      { icon: checkmark, text: 'Basic Scan Depth' },
      { icon: checkmark, text: 'Weekly Scans & Reports' },
    ],
  };


  return (
    <div className='subscription-plan'>
      <div className='upper-content p-0'>
        <div className="upper-progress ">
          <div className="backbtn" style={{ cursor: "pointer" }} >
            <img src={BackIcon} alt="" />
          </div>
          <CustomProgressBars
            progress1={progress.progress1}
            progress2={0}
            progress3={0}

          />
        </div>
        <div className="subscription-heading">
          <div className='d-flex justify-content-between'>
            <div className='inputs-heading'>
              <div className="titile-subtitle">
                <div className="heading">
                  <h2>Select subscription plan</h2>
                  <p>Please provide your email address.<br />
                    We will send you link to reset your password.</p>
                </div>
              </div>
            </div>
            <div className='inputs-tabs'></div>
          </div>

        </div>

      </div>
      <div className="plan-cards">
        <SubCard {...cardOneData1} onClick={handleNavigate} />
        <SubCard {...cardOneData2} onClick={handleNavigate} />

      </div>
    </div>
  )
}

export default SubscriptionPlan