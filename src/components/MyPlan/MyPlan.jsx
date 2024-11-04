import React, { useState, useEffect } from 'react';
import './MyPlan.css';
import Sidebar from '../SideBar/Sidebar';
import PlanCard from './PlanCard/PlanCard';
import searchIcon from '../../assets/images/search.svg';
import PlusSign from '../../assets/images/plus.svg';
import Magicpen from '../../assets/images/Magicpen.svg';
import lightMenu from '../../assets/images/More_Vertical_light.svg';
import darkMenu from '../../assets/images/More_Vertical_dark.svg';
import { useNavigate } from 'react-router-dom';
import { cardDataArray } from '../../utility/cardDummyData'
import { Tooltip } from '@mui/material';
const MyPlan = () => {
    const [borders, setBorders] = useState([]);
    const [lightMenus, setLightMenus] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // ----------------------------------------------------------FOR LIGHT AND DARK MENU AND BORDER-----------------------------------------------------------------
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/create-plan');
    };
    const handleUpload = () => {
        navigate('/analyze-plan');
    };


    useEffect(() => {
        setBorders(new Array(cardDataArray.length).fill(false));
        setLightMenus(new Array(cardDataArray.length).fill(true));
    }, [cardDataArray.length]);

    const handleToggleMenu = (index) => {
        setBorders((prevBorders) =>
            prevBorders.map((border, i) => (i === index ? !border : border))
        );
        setLightMenus((prevMenus) =>
            prevMenus.map((isLight, i) => (i === index ? !isLight : isLight))
        );
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className='myPlancontainer d-flex justify-content-start'>
            <div className='side-navigation'>
                <Sidebar />
            </div>
            <div className="allPlans">
                <div className="allPlans-inner">
                    <div className="allPlansTite">
                        <h1>My Plans</h1>
                        <p>View and manage all the plans you've created. Easily track their status, make updates, or access detailed information to ensure everything is aligned with your goals.</p>
                    </div>
                    <div className="allPlansCards">
                        <div className="upperButtons">
                            <div className="button-row">
                                    <div className="searchInputContainer" style={{ cursor:"not-allowed"}}>
                                <Tooltip title="Coming Soon" placement="top-start">
                                        <input type="text" placeholder="Search" style={{ cursor:"not-allowed", pointerEvents:"none"}} />
                                        <img src={searchIcon} alt="searchIcon" className="searchIcon" />
                                </Tooltip>
                                    </div>

                                <div className="planButtons">
                                    <button className="uploadPlan" onClick={handleUpload}>
                                        <img src={PlusSign} alt="" />Upload plan
                                    </button>
                                    <button className="planGenerator" onClick={handleButtonClick}>
                                        <img src={Magicpen} alt="" />
                                        <span>Plan Generator</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="planCards">
                            <div className="planCardsGrid">
                                {/* {cardDataArray.map((data, index) => {
                                    const { heading, description, ...restData } = data;
                                    return (
                                        <PlanCard
                                            key={index}
                                            lightMenu={lightMenu}
                                            darkMenu={darkMenu}
                                            handleToggleMenu={() => handleToggleMenu(index)}
                                            hasBorder={borders[index]}
                                            handleClose={handleClose}
                                            isLightMenu={lightMenus[index]}
                                            heading={heading}
                                            description={description}
                                            cardData={restData}
                                        />
                                    );
                                })} */}

                                {cardDataArray.map((data, index) => {
                                    const { heading, description, id, ...restData } = data;
                                    return (
                                        <PlanCard
                                            key={id}
                                            id={id}
                                            heading={heading}
                                            description={description}
                                            {...restData}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPlan;
