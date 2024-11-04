import React from 'react';
import { useNavigate } from 'react-router-dom';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import show from '../../../assets/images/Show.svg';
// import download from '../../../assets/images/Download.svg';
// import deleteIcon from '../../../assets/images/delete.svg';

import "./PlanCard.css";

const PlanCard = ({ id, hasBorder, lightMenu, darkMenu, isLightMenu, handleToggleMenu, description, heading }) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        // Navigate to the detail page for this specific card
        navigate(`/create-plan/${id}`);
    }; 
    return (
        <div className='myPlanCard' onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="innerPlancard">
                {/* <div className="planHeading">
                    <div className="aboutPlan">
                        <div className="inner-plan-text">
                            <p>About</p>
                        </div>
                    </div>
                    <div className="cardMenu"
                        style={{
                            border: hasBorder ? '2px solid #649499' : 'none',
                            cursor: 'pointer'
                        }}
                        onClick={handleToggleMenu}>
                        <img src={isLightMenu ? lightMenu : darkMenu} alt="Menu Icon" />
                    </div>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}

                    >
                        <MenuItem onClick={handleClose}><img src={show} alt="show" />Profile</MenuItem>
                        <MenuItem onClick={handleClose}><img src={download} alt="show" />My account</MenuItem>
                        <MenuItem onClick={handleClose}><img src={deleteIcon} alt="show" />Logout</MenuItem>
                    </Menu>
                </div> */}
                <div className="planDescription">
                    <div className="plan-title">
                        <h2>{heading}</h2>
                    </div>
                    <p>{description}</p>
                </div>
                {/* <div className="planButton">
                    <button>In progress</button>
                </div> */}
            </div>
        </div>
    );
}

export default PlanCard;
