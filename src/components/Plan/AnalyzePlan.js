import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../SideBar/Sidebar';
import magicIcon from '../../assets/images/Magicpen.svg';
import pdfUploaded from '../../assets/images/pdf-document.svg';
import deleteIcon from '../../assets/images/delete.svg';
import uploadImg from '../../assets/images/Cloud_Upload.svg';
import './AnalyzePlan.css';
import { excelFile } from '../../api/excelfile';
import { CircularProgress, Snackbar, Alert } from '@mui/material';
import ExcelParsingResViewerModal from '../ExcelParsingResViewer/ExcelParsingResViewerModal';

const AnalyzePlan = () => {
    const messages = [
        'Uploading your plan',
        'Plan uploaded',
        'Analyzing your plan',
        'Waiting for response',
        'This may take some time'
    ];

    const [selectedFile, setSelectedFile] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const allowedFileTypes = ['.xls', '.xlsx', '.xlsm', '.csv'];
    const [errorMessage, setErrorMessage] = useState('');
    const [filePath, setFilePath] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [newFileSelected, setNewFileSelected] = useState(false);
    const fileInputRef = useRef(null);
    const [excelResponse, setExcelResponse] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [excelformat, setExcelformat] = useState(false);
    const [message, setMessage] = useState(messages[0]);
    const [looped, setLooped] = useState(false);
    const [isDragging, setIsDragging] = useState(false);


    useEffect(() => {
        if (!isUploading) return;
        if (looped) return;

        const interval = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                if (currentIndex === messages.length - 1) {
                    setLooped(true);
                    clearInterval(interval);
                    return messages[messages.length - 1];
                }
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 6000);

        return () => clearInterval(interval);
    }, [looped, isUploading]);

    const handleFileChange = (file) => {
        if (file) {
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            const fileSize = file.size / (1024 * 1024); // Convert size to MB

            if (!allowedFileTypes.includes(fileExtension)) {
                setSelectedFile(null);
                setErrorMessage('Invalid file type. Please upload an Excel or CSV file.');
            } else if (fileSize > 5) {
                setSelectedFile(null);
                setErrorMessage('File size exceeds the 5 MB limit. Please upload a smaller file.');
            } else {
                setSelectedFile(file);
                setIsFileSelected(true);
                setErrorMessage('');
                setNewFileSelected(true);
            }
        }
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            setIsUploading(true);
            setNewFileSelected(false);

            excelFile(selectedFile)
                .then(response => {
                    if (response?.type === "invalid_format") {
                        setExcelformat(true);
                    }

                    if (!response?.status) {
                        const errorMsg = response?.message || 'Error uploading file';
                        setSnackbarMessage(errorMsg);
                        setSnackbarSeverity('error');
                        setOpenSnackbar(true);
                    } else {
                        const successMsg = response.message || 'File uploaded successfully';
                        setSnackbarMessage(successMsg);
                        setSnackbarSeverity('success');
                        setOpenSnackbar(true);
                        setFilePath(response.filePath);
                        setExcelResponse(response);
                        setShowModal(true);
                        setSelectedFile(null);
                    }
                })
                .catch(error => {
                    const errorMsg = error.response?.data?.message || 'Error uploading file';
                    setSnackbarMessage(errorMsg);
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                })
                .finally(() => {
                    setIsUploading(false);
                });
        } else {
            setSnackbarMessage('Please select a file');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleDownload = () => {
        if (filePath) {
            const backendUrl = process.env.REACT_APP_BACKEND_URL_DOWNLOAD;
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

    const handleExcelDownload = () => {
        const file = "/test-sheet.xlsx";
        const link = document.createElement("a");
        link.href = file;
        link.download = "test-sheet.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleDeleteBtn = () => {
        setSelectedFile(null);
    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };
    if (showModal && excelResponse?.finalResult?.strength_count >= 0) {
        return <ExcelParsingResViewerModal excelResponse={excelResponse} />;
    }

    return (
        <>
            {/* {showModal && excelResponse?.finalResult?.strength_count >= 0 && <ExcelParsingResViewerModal showModal={showModal} setShowModal={setShowModal} excelResponse={excelResponse} />} */}
            <div className='analyze-plan-container d-flex justify-content-start'>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} className="snackbar">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                <div className='side-navigation'>
                    <Sidebar />
                </div>
                <div className='analyze-plan'>
                    <div className='analyze-new-plan'>
                        <div className='analyze-upload-content'>
                            <h1 className='title-container-main'>Analyze plan</h1>
                            <p>Upload your plan here to get an AI-driven analysis. Simply select a plan from the dropdown or drag and drop your file, then click "Analyze with AI" to receive insights and recommendations.</p>

                        </div>
                        <div className='analyze-form'>
                            <div className='analyze-form-inner'>
                                <div className='analyze-contents'>
                                    <div className='analyze-inputs'>
                                        <h3>Upload a plan for analysis</h3>
                                        {/* Upload area */}
                                        <div
                                            className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <div className='file-upload-area-inner'>

                                                <label htmlFor="fileInput" className="file-upload-label"
                                                >

                                                    <div className="upload-icon">
                                                        <img src={uploadImg} alt="Upload Icon" />
                                                    </div>
                                                    <div className='d-flex flex-column justify-content-center align-items-center' style={{ gap: '6px' }}>


                                                        <div className='drag-drop'>
                                                            <span>Click to Upload</span> <strong>Drag & Drop</strong>
                                                        </div>
                                                        <div className='upload-filesizes'>
                                                            <p className="upload-hint">Accepted formats: xls, xlsx, xlsm, csv </p>
                                                            <p> Max file size: 5MB</p>
                                                        </div>

                                                    </div>
                                                    {errorMessage && (
                                                        <div
                                                            style={{
                                                                width: 'auto',
                                                                maxWidth: '100%', 
                                                                borderRadius: '4px',
                                                                background: 'linear-gradient(0deg, rgba(198, 0, 0, 0.15), rgba(198, 0, 0, 0.15))',
                                                            }}
                                                        >
                                                            <p className="errorMessag">{errorMessage}</p> {/* Use correct class name */}
                                                        </div>
                                                    )}
                                                </label>


                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    hidden
                                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                    ref={fileInputRef}
                                                    onChange={(e) => handleFileChange(e.target.files[0])}
                                                />

                                            </div>

                                        </div>
                                        {selectedFile && (
                                            <div className='file-selected'>
                                                <div className='analyze-pdf-uploaded'>
                                                    <div className='pdf-icon'>
                                                        <img src={pdfUploaded} alt='file uploaded' />
                                                    </div>
                                                    <div className='pdf-text'>
                                                        <span>{selectedFile.name}</span>
                                                        <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                                    </div>
                                                </div>
                                                <div className='analyze-delete' onClick={handleDeleteBtn}>
                                                    <img src={deleteIcon} alt='delete icon' />
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    <div className='analyze-form-actions'>

                                        <button type="submit" className="btn-with-icon" onClick={handleFileUpload}>
                                            {isUploading ? (
                                                <>
                                                    <CircularProgress size={24} style={{ color: 'white', marginRight: '8px' }} />
                                                    {message}
                                                </>
                                            ) : (
                                                <>

                                                    <img src={magicIcon} alt="Icon" className="button-icon" />
                                                    <sapn className='btn-text' > Analyze with AI</sapn>

                                                </>
                                            )}
                                        </button>
                                        {filePath && !newFileSelected && !isUploading && (
                                            <div className="form-actions">
                                                <button type="button" className="btn-with-icon" onClick={handleDownload}>
                                                    Download AI Response
                                                </button>
                                            </div>
                                        )}
                                        {excelformat && (
                                            <div className="form-actions mt-3">
                                                <button type="button" className="btn-with-icon" onClick={handleExcelDownload}>
                                                    Download Reference Excel
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </>
    );
};

export default AnalyzePlan;
