import React, { useState, useEffect, useCallback } from 'react';
import './PlanDetails.css';
import Sidebar from '../SideBar/Sidebar';
import Table from 'react-bootstrap/Table';
import searchIcon from '../../assets/images/search.svg';
import PlusSign from '../../assets/images/plus.svg';
import Magicpen from '../../assets/images/Magicpen.svg';
import { getPlansByEmail, searchPlansOfUser } from '../../api/user.js';
import { debounce } from '../../utility/debounce.js';
import Tooltip from '@mui/material/Tooltip';
import { TableContainer, Paper, CircularProgress } from '@mui/material'; // Add CircularProgress for loader

const PlanDetails = () => {
    const [plans, setPlans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    const fetchPlans = async () => {
        setLoading(true); // Start loader
        try {
            const email = localStorage.getItem('email');
            if (!email) {
                throw new Error('User email not found in local storage');
            }

            const data = { email };
            const response = await getPlansByEmail(data);
            console.log("plan Detail", response);

            if (response.status) {
                setPlans(response.plans);
            } else {
                console.log("Failed to fetch plans");
            }
        } catch (error) {
            console.log(error.message || 'Error fetching plans');
        } finally {
            setLoading(false); // Stop loader
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSearch = useCallback(
        debounce(async (searchTerm) => {
            setLoading(true); // Show loader while searching
            const email = localStorage.getItem('email');
            if (!email) {
                throw new Error('User email not found in local storage');
            }
            const data = { email, searchTerm };
            const response = await searchPlansOfUser(data);

            if (response.error) {
                console.log("Error while searching user data", response.error);
            } else {
                setPlans(response.plans || []);
            }

            setLoading(false); // Stop loader after search results
        }, 500),
        []
    );
    const handleDownload = (filePath) => {
        console.log("Extracted file path:", filePath);
        
        if (filePath) {
            const backendUrl = process.env.REACT_APP_BACKEND_URL_API;
            const downloadUrl = `${backendUrl}${filePath}`;
            
            // Create an invisible anchor element
            const link = document.createElement('a');
            link.href = downloadUrl;
            
            // Specify the download attribute to trigger the file download
            link.setAttribute('download', filePath);
            
            // Append the link to the body and trigger the click
            document.body.appendChild(link);
            link.click();
            
            // Clean up the link element
            document.body.removeChild(link);
        } else {
            console.error("No file path available for download.");
        }
    };
    

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
    };

    return (
        <div className='paln-details-container d-flex justify-content-start'>
            <div className='side-navigation'>
                <Sidebar />
            </div>
            <div className="plan-details-data">
                <div className='plan-details-data-inner'>
                    <div className="plan-detail-title">
                        <h2>Plan Details</h2>
                        <p>View a detailed overview of your selected plan, displaying all key activities organized by project phases.</p>
                    </div>

                    <div className="plan-detail-table">
                        <div className="plan-filter">
                            <div className="searchInputContainer">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                />
                                <img src={searchIcon} alt="searchIcon" className="searchIcon" />
                            </div>
                        </div>
                        <div className="plans-table">
                            <div className="inner-plan-table">
                                <div className="plan-template">
                                    <TableContainer
                                        component={Paper}
                                        style={{
                                            maxHeight: '600px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        <Table className='data-collection'>
                                            <thead>
                                                <tr>
                                                    <th>Plan Id</th>
                                                    <th>Project Name</th>
                                                    <th>Project Started</th>
                                                    <th>Type of change</th>
                                                    <th>Project Lifecycle</th>
                                                    <th>Potential job losses</th>
                                                    <th>Variant Impact</th>
                                                    <th>Impact among employees</th>
                                                    <th>User's change process stage?</th>
                                                    {/* <th>How varied is employee change?</th> */}
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan="9" style={{ textAlign: 'center' }}>
                                                            <CircularProgress /> {/* Loader while plans are loading */}
                                                        </td>
                                                    </tr>
                                                ) : plans?.length > 0 ? (
                                                    plans.map((plan, index) => (
                                                        <tr key={plan._id}>
                                                            <td>{index + 1}</td>
                                                            <td>{plan.planName}</td>
                                                            <td>{String(plan.hasProjectStarted)}</td>
                                                            <td>{plan.changeType}</td>
                                                            <td>{plan.projectPhase}</td>
                                                            <td>{plan.potentialJobLoses}</td>
                                                            {/* <td>{plan.variantImpact}</td> */}
                                                            <td>{plan.employeeImpact}</td>
                                                            <td>{plan.userChangeProcess}</td>
                                                            <td>{plan.groupEmpChange}</td>
                                                            <td>
                                                                <div className="planButtons">
                                                                    <button
                                                                        className="uploadPlan"
                                                                        onClick={() => handleDownload(plan.filePath)}>
                                                                        Download
                                                                    </button>
                                                                    <Tooltip title="Coming Soon" arrow placement='top'>
                                                                        <button className="planGenerator" >
                                                                            <span>Re-Analyze</span>
                                                                        </button>
                                                                    </Tooltip>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" style={{ textAlign: 'center' }}>
                                                            No plans found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDetails;
