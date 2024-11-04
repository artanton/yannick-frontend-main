import React, { useState, useEffect } from 'react';
import './CreatePlan.css';
import userImg from '../../assets/images/Vector.png';
import magicIcon from '../../assets/images/Magicpen.png';
import { aiReplier } from '../../api/prompt';
import { questionsAndAnswers } from './questionsAndAnswers/questionsAndAnswers';
import Sidebar from '../SideBar/Sidebar';
import { useParams } from 'react-router-dom';
import Select, { StylesConfig } from 'react-select';
import { CircularProgress, Snackbar, Alert } from '@mui/material';
import { cardDataArray } from '../../utility/cardDummyData'
const colourStyles = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid #C6CFDB',
    boxShadow: 'none',
    borderColor: isFocused ? '#C6CFDB' : 'none',
    ':focus': {
      borderColor: 'none',
      boxShadow: 'none',
      boder: "none",
      outline: "none",
      opacity: '0px'
    },
    // width: '420px',
    // height: '45px',
    padding: '7px 16px',
    gap: '8px',
    borderRadius: '4px ',
    outline: "none",
    opacity: '0px',
  }),
};


const CreatePlan = () => {
  const { id } = useParams();

  // Find the card based on the id from URL params
  const card = cardDataArray.find(card => card.id === id);

  const [formData, setFormData] = useState({
    projectName: '',
    started: '',
    answers: questionsAndAnswers.map(() => ""),
    employeeRange: { from: '', to: '' },
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [filePath, setFilePath] = useState(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);  // For controlling the button visibility
  const [isExistingRecord, setIsExistingRecord] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');




  // Set default values based on the `card` when the component mounts
  useEffect(() => {
    if (id) {
      const card = cardDataArray.find(card => card.id === id);
      if (card) {
        setFormData({
          projectName: card.projectName || '',
          started: card.projectStarted.toLowerCase() || '',
          answers: [card.typeOfChange, card.projectLifecycle, card.jobLosses, card.impactEmployees,card.userChangeProcess,card.groupEmpChange],
          employeeRange: { from: card.from || '', to: card.to || '' },
        });
      }
    } else {
      // Set default values if id is not provided
      setFormData({
        projectName: '',
        started: '',
        answers: questionsAndAnswers.map(() => ""),
        employeeRange: { from: '', to: '' },
      });
    }
  }, [id, cardDataArray, questionsAndAnswers]);

  // New useEffect to log changes in answers
  useEffect(() => {
    if (formData.answers) {
      console.log("answers", formData.answers);
    }
  }, [formData.answers]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'from' || name === 'to') {
      setFormData((prevData) => ({
        ...prevData,
        employeeRange: {
          ...prevData.employeeRange,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleEmployee = (e) => {
    const { name, value } = e.target;

    // Allow blank input without showing an error
    if (value === '') {
      setFormData((prevData) => ({
        ...prevData,
        employeeRange: {
          ...prevData.employeeRange,
          [name]: ''
        },
      }));
      setErrorMessage('');
      return;
    }

    // Validate for positive numbers only
    const parsedValue = parseInt(value, 10);
    if (!/^\d+$/.test(value) || isNaN(parsedValue) || parsedValue <= 0) {
      setErrorMessage('Please enter a positive number.');
      return;
    }

    // Update the input field for "from" or "to"
    setFormData((prevData) => ({
      ...prevData,
      employeeRange: {
        ...prevData.employeeRange,
        [name]: parsedValue,
      },
    }));

    // Clear error message if input is valid
    setErrorMessage('');
  };
  // Handle "to" field validation on blur
  const handleBlur = () => {
    const { from, to } = formData.employeeRange;
    if (to !== '' && from !== '' && to < from) {
      setErrorMessage('"To" value cannot be less than "From" value.');
    } else {
      setErrorMessage(''); // Clear error if valid
    }
  };
  
  useEffect(() => {
    let timeoutId;

    if (filePath && isExistingRecord) {
      setLoading(true)
      setShowDownloadButton(false);
      timeoutId = setTimeout(() => {
        setLoading(false);  
        setShowDownloadButton(true);
      }, 10000); 
    } else if (filePath && !isExistingRecord) {
      setShowDownloadButton(true);
    }

    // Clean up the timeout when the component unmounts or filePath changes
    return () => clearTimeout(timeoutId);
  }, [filePath, isExistingRecord]);

  const handleSelectChange = (selectedOption, index) => {
    if (selectedOption && selectedOption.value) {
      const newAnswers = [...formData.answers];
      newAnswers[index] = selectedOption.value;
      setFormData(prevData => ({
        ...prevData,
        answers: newAnswers,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.answers.some(answer => answer.trim() === '') || formData.projectName.trim() === '' || formData.started.trim() === '') {
      console.log("data", formData)
      setSnackbar({ open: true, message: 'Please fill in all the fields.', severity: 'error' });
      return;
    }
    const formattedData = {
      planName: formData.projectName,
      hasProjectStarted: formData.started === 'yes',
      changeType: formData.answers[0],
      projectPhase: formData.answers[1],
      potentialJobLoses: formData.answers[2],
      // variantImpact: formData.answers[3],
      employeeImpact: `${formData.employeeRange.from} - ${formData.employeeRange.to}`,
      email: localStorage.getItem("email"),
      userChangeProcess: formData.answers[3] ?? '',
      groupEmpChange : formData.answers[4] ?? ''
    };
    setLoading(true);
    try {
      const response = await aiReplier({ answers: formattedData });
      console.log("existing result check",response);
      setFilePath(response.filePath);
      setIsExistingRecord(response.isExistingRecord);
      setSnackbar({ open: true, message: response.message, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error generating plan.', severity: 'error' });
    }

    setLoading(false);

  };

  

  const handleDownload = () => {
    if (filePath) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL_API;
      const fullPath = `${backendUrl}/${filePath}`;
      const link = document.createElement('a');
      link.href = fullPath;
      link.download = 'ai_response.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setFilePath(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (

    <div className='create-plan-container d-flex justify-content-start'>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <div className='side-navigation'>
        <Sidebar />
      </div>
      <div className="create-plan">
        <div className='create-new-plan'>
          <div className="create-title-container">
            <h1>Create plan</h1>
            <p>Use this form to create a customized change management plan by entering details about your project.</p>

          </div>
          <div className="form-container">
            <div className="create-inputs-inner">
              <form className="form-content" >
                <div className="row d-flex  m-0">
                  {/* Project Name */}
                  <div className="col-md-6  mb-0 p-0">
                    <div className="form-group">
                      <label>Project Name</label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        placeholder="Enter project name"
                      />
                    </div>
                  </div>

                  {/* Project Started Radio Buttons */}
                  <div className="col-md-6 mb-0 p-0">
                    <div className="form-group">
                      <label>Has the project started?</label>
                      <div className="radio-group">
                        <label style={{ marginBottom: "5px" }}>
                          <input
                            style={{ width: '20px', height: '20px' }}
                            type="radio"
                            name="started"
                            value="yes"
                            checked={formData.started === 'yes'}
                            onChange={handleChange}
                          /> Yes
                        </label>
                        <label>
                          <input
                            style={{ width: '20px', height: '20px' }}
                            type="radio"
                            name="started"
                            value="no"
                            checked={formData.started === 'no'}
                            onChange={handleChange}

                          /> No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="row d-flex m-0">
                  {/* First row for the first two select boxes */}
                  {questionsAndAnswers.slice(0, 2).map((qa, index) => (
                    <div key={index} className={`col-md-6 mb-0 p-0`}>
                      <div className="form-group">
                        <label>{qa.question}</label>
                        <Select
                          className='select'
                          options={qa.answers}
                          placeholder="Select"
                          styles={colourStyles}
                          value={qa.answers.find(option => option.value === formData.answers[index]) || null}
                          onChange={(selectedOption) => handleSelectChange(selectedOption, index)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row d-flex m-0">
                  {/* Second row for the next two select boxes */}
                  {questionsAndAnswers.slice(2, 4).map((qa, index) => (
                    <div key={index + 2} className="col-md-6 mb-0 p-0">
                      <div className="form-group">
                        <label>{qa.question}</label>
                        <Select
                          className='select'
                          options={qa.answers}
                          placeholder="Select"
                          styles={colourStyles}
                          value={qa.answers.find(option => option.value === formData.answers[index + 2]) || null}
                          onChange={(selectedOption) => handleSelectChange(selectedOption, index + 2)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row d-flex m-0">
                  {/* Second row for the next two select boxes */}
                  {questionsAndAnswers.slice(4).map((qa, index) => (
                    <div key={index + 2} className="col-md-6 mb-0 p-0">
                      <div className="form-group">
                        <label>{qa.question}</label>
                        <Select
                          className='select'
                          options={qa.answers}
                          placeholder="Select"
                          styles={colourStyles}
                          value={qa.answers.find(option => option.value === formData.answers[index + 4]) || null}
                          onChange={(selectedOption) => handleSelectChange(selectedOption, index + 4)}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Estimated number of employees impacted</label>
                    <div className="employee-range">
                      <div className="input-group">
                        <input
                          type="number"
                          name="from"
                          value={formData.employeeRange.from}
                          onChange={handleEmployee}
                          placeholder="From"
                          onKeyDown={(e) => e.key === '-' || e.key === '+' ? e.preventDefault() : null} 
                        />
                        <img className="icon" src={userImg} alt="User Icon" />
                      </div>
                      <div className="input-group">
                        <input
                          type="number"
                          name="to"
                          value={formData.employeeRange.to}
                          onChange={handleEmployee}
                          onBlur={handleBlur} // Validate "To" value when the user finishes typing
                          placeholder="To"
                          onKeyDown={(e) => e.key === '-' || e.key === '+' ? e.preventDefault() : null} 
                        />
                        <img className="icon" src={userImg} alt="User Icon" />
                      </div>
                    </div>
                    {errorMessage && (
                      <div
                        style={{
                          width: 'auto', // Flexible width based on content
                          maxWidth: '100%', // Optional, set max width if needed
                          padding: '4px', // Add padding for spacing around the text
                          borderRadius: '4px',
                          background: 'linear-gradient(0deg, rgba(198, 0, 0, 0.15), rgba(198, 0, 0, 0.15))',
                        }}
                      >
                        <p className="errorMessag" >{errorMessage}</p> {/* Use correct class name */}
                      </div>
                    )}

                  </div>
                </div>


              </form>
              {/* Moved button inside form to ensure form submission works */}
              <div className="form-actions">
                <button type="submit" className="btn-with-icon" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <CircularProgress size={24} style={{ color: 'white', marginRight: '8px' }} />
                      <span>Waiting for response...</span>
                    </>
                  ) : (
                    <>
                      <img src={magicIcon} alt="Icon" className="button-icon" />
                      Generate change plan
                    </>
                  )}
                </button>
              </div>


              {/* Display download button if filePath is available */}
              {showDownloadButton && filePath && (
                <div className="form-actions">
                  <button onClick={handleDownload} className="btn-with-icon">
                    <img src={magicIcon} alt="Icon" className="button-icon" />
                    Download AI Response
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default CreatePlan;
