import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import sidebarlogo from '../../assets/images/sidelogo.svg';
import NoteEdit from '../../assets/images/Note_Edit.png';
import ShareIcon from '../../assets/images/Share_Android.svg';
import profile from '../../assets/images/profile.svg';
import ChartLine from '../../assets/images/Chart_Line.svg';
import Dashboard from '../../assets/images/Dashboard.svg';
import Frame from '../../assets/images/Frame.svg';
import Arrow from '../../assets/images/Arrow.png';
import ArrowDown from '../../assets/images/arrowDown.svg';
import useUserStore from '../../stores/useUserStore';

const Sidebar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [isPlanCollapsed, setIsPlanCollapsed] = useState(false);
  const { user, username, fetchUserData } = useUserStore();

  useEffect(() => {
    // Assuming email is stored in local storage or passed down as props
    const email = localStorage.getItem('email'); // Retrieve email from local storage
    if (email) {
        fetchUserData(email); 
        console.log("user email", email)
    }
}, [fetchUserData]);

  const handleMenuClick = (path) => {
    setActivePath(path);
  };

  const togglePlanCollapse = () => {
    setIsPlanCollapsed(!isPlanCollapsed);
  };
  const handleLogout = () => {

    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    window.location.href = '/login';
    // navigate('/login');
  };



  return (
    <div className="sidebar">
      <Container className="sidebar-content">
        <div className="inner-div">
          <div className='upper-charts'>
            <div className="logo">
              <img src={sidebarlogo} alt="Logo" />
            </div>
            <div className='start-chat toolkit-container'>
              <button className='toolkit-container'>Start Chat</button>
            </div>
            <div className='drop-down'>

              <div className='dashboard toolkit-container'>
                <img src={Dashboard} alt="Dashboard" />
                <div className='dashboard-text'><span>Dashboard </span></div>
              </div>
              <div className={`menu-item plan-generator ${isPlanCollapsed ? ' expanded' : 'collapsed'}`}>
                <div className={`menu-title ${isPlanCollapsed ? 'collapsed' : 'expanded'}`}
                  onClick={togglePlanCollapse}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img src={NoteEdit} alt="Edit Icon" className="menu-icon" />
                    <span className='planside-heading'>Plan generator</span>
                  </div>
                  <img
                    src={Arrow}
                    alt="Collapse Arrow"
                    className={`collapse-icon ${isPlanCollapsed ? 'collapsed' : ''}`}
                  />
                </div>

                <div className={`submenu ${isPlanCollapsed ? '' : 'expanded'}`}>
                  <Link
                    to="/my-plans"
                    className={`submenu-item ${activePath === '/my-plans' ? 'active' : ''}`}
                    // onClick={() => handleMenuClick('/create-plan')}
                    onClick={() => handleMenuClick('/my-plans')}
                  >
                    Generate plan
                  </Link>
                  <Link
                    to="/plan-details"
                    className={`submenu-item ${activePath === '/plan-details' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('/plan-details')}
                  >
                    My plans
                  </Link>
                  <Link
                    to="/analyze-plan"
                    className={`submenu-item ${activePath === '/analyze-plan' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('/analyze-plan')}
                  >
                    Analyze plan
                  </Link>
                </div>
              </div>



              <div className='menu-item plan-generator '>
                <div className='menu-title'>
                  <div className="toolkit-container" style={{ display: 'flex', gap: '12px' }}>
                    <img src={ChartLine} alt="chart Icon" className="menu-icon" />
                    <span className='planside-heading'>Predictive analytics</span>
                  </div>
                  <img
                    src={ArrowDown}
                    alt="Collapse Arrow"
                    className={`collapse-icon  toolkit-container `}
                  />
                </div>
              </div>

              <div className='menu-item plan-generator '>
                <div className='menu-title'>
                  <div className="toolkit-container" style={{ display: 'flex', gap: '12px' }}>
                    <img src={ShareIcon} alt="Edit Icon" className="menu-icon" />
                    <span className='planside-heading'>Change toolkit</span>
                  </div>

                  <img
                    src={ArrowDown}
                    alt="Collapse Arrow"
                    className={`collapse-icon toolkit-container `}
                  />
                </div>
              </div>



            </div>
          </div>
          <div className='saved-charts toolkit-container'>
            <div className='inner-saved-charts'>
              <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                <div className='save-chat'>
                  <img src={Frame} alt="profile-logo" />
                  <div className='save-chat-text'><span>Main tools </span></div>
                </div>

                <div className='save-chat'>
                  <img src={Frame} alt="profile-logo" />
                  <div className='save-chat-text'><span>Design strategy </span></div>
                </div>

                <div className='save-chat'>
                  <img src={Frame} alt="profile-logo" />
                  <div className='save-chat-text'><span>File explanation </span></div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* <div className='logout-button'>
          <div className='profile-img'><img src={profile} alt="profile-logo" /></div>
          <span>Miya Donowan Logout</span>
        </div> */}

        <div className='logout-button' onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <div className='profile-img'>
            <img src={profile} alt="profile-logo" />
          </div>
          <span>{username} </span>
        </div>
      </Container>

    </div>
  );
};

export default Sidebar;
