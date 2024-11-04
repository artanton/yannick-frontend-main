import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import MenuIcon from '@mui/icons-material/Menu';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import './UpgradePlan.css'

const UpgradePlan = () => {
    const [show, setShow] = useState(false);
    const handelCreatePlan = () => {
       
        window.location.href = "http://185.142.34.165:3900/";
    }

    const handelUpgradePlan = () => {
        
        window.location.href = "http://185.142.34.165:3900/upload-file";


    }
    const handleadmin = () => {
       
        window.location.href = "http://185.142.34.165:3900/admin";
    }
    return (
        <>
            <div className="upgrade-plan-container">
                <Dropdown show={show} onToggle={() => setShow(!show)} style={{ alignSelf: 'flex-end' }}>
                    <MenuIcon style={{ fontSize: '40px', cursor: 'pointer', color: '#016FD0' }} onClick={() => setShow(!show)} />
                    <Dropdown.Menu className={`dropdown-menu ${show ? 'show' : ''}`}>
                        <Dropdown.Item onClick={handleadmin} className='drop-item'>Prompt manager</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Container className="d-flex flex-column align-items-center vh-100 upgrade-plan-inner-container">

                    <Row className="d-flex align-items-center justify-content-center w-100" style={{ height: '100px' }}>
                        <span className='text-center want-to-style'>
                            Do you want to?
                        </span>
                    </Row>
                    <Row className="w-100 custom-responsive-row"
                        style={{ height: '200px' }}>
                        <Col className="d-flex justify-content-center align-items-center mb-3 mb-md-0" xs={12} md={5}>
                            <Button
                                className="action-button"
                                variant="primary"
                                onClick={handelCreatePlan}
                            >
                                <div className='d-flex flex-column align-items-center' style={{ gap: '10px' }}>
                                    <AppRegistrationIcon style={{ height: '30px', width: '30px' }} />
                                    <span>Create new Plan</span>
                                </div>
                            </Button>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center mb-3 mb-md-0" xs={12} md={2}>
                            OR
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center" xs={12} md={5}>
                            <Button
                                className="action-button"
                                variant="primary"
                                onClick={handelUpgradePlan}
                            >
                                <div className='d-flex flex-column align-items-center' style={{ gap: '10px' }}>
                                    <FileCopyIcon style={{ height: '30px', width: '30px' }} />
                                    <span>Upgrade existing Plan</span>
                                </div>
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>


        </>
    )
}

export default UpgradePlan