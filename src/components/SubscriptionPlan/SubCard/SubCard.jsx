// SubCard.js
import React from 'react';
import "./SubCard.css"
const SubCard = ({ onClick, planName, price, features = [], planType, imageSrc }) => {
    return (
        <div className='pricing-card' onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="card-heading">
                <div className="card-logo">
                    <div className="share-logo">
                        <img src={imageSrc} alt={`${planName} ${planType}`} />
                    </div>
                    <div className="plan-name">
                        <span>{planName}</span>
                        <h2>{planType}</h2>
                    </div>
                </div>
                <div className="card-price d-flex">
                    <h1>${price}</h1>
                    <span>Per month</span>
                </div>
            </div>
            <div className="card-description">
                {features.length > 0 && (
                    <>
                        <p>Everything in Free and..</p>
                        <div className="list-item">
                            {features.map((feature, index) => (
                                <div key={index} className="card-list d-flex">
                                    <span><img src={feature.icon} alt="check" /></span>
                                    <p>{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="card-btn" style={{ marginTop: features.length > 0 ? '0px' : '60%' }}>
                <button><span>Select plan</span></button>
            </div>

            {/* <div className="card-btn">
                <button><span>Select plan</span></button>
            </div> */}
        </div>
    );
};

export default SubCard;
