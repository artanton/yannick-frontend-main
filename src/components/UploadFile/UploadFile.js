import React, { useState, useRef, useEffect } from 'react';
import { Grid, Box, Button, Snackbar, Alert, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { excelFile } from '../../api/excelfile';
import ExcelParsingResViewerModal from '../ExcelParsingResViewer/ExcelParsingResViewerModal';

const FileUploadComponent = () => {

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
    const handleBoxClick = () => {
        if (!isUploading) {
            fileInputRef.current.click();
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (allowedFileTypes.includes(fileExtension)) {
                setSelectedFile(file);
                setIsFileSelected(event.target.files.length > 0);
                setErrorMessage('');
                setNewFileSelected(true);
            } else {
                setSelectedFile(null);
                setErrorMessage('Invalid file type. Please upload an Excel or CSV file.');
            }
        }
    };

    const handleExcelDownload = () => {
        const file = "/test-sheet.xlsx";
        const link2 = document.createElement("a");
        link2.href = file;
        link2.download = "test-sheet.xlsx"; 
        document.body.appendChild(link2);
        link2.click();
        document.body.removeChild(link2);
    };

    return (
        <>
            {showModal && excelResponse?.finalResult?.strength_count >= 0 && <ExcelParsingResViewerModal showModal={showModal} setShowModal={setShowModal} excelResponse={excelResponse} />}
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
            >
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
                <Grid
                    item
                    xs={12}
                    sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', mx: 'auto' }}
                >
                    <Box
                        display="flex"
                        padding="40px"
                        flexDirection="column"
                        alignItems="center"
                        height="100%"
                        justifyContent="center"
                        // width="20%"
                        width="230px"
                        bgcolor="#016FD0"
                        sx={{
                            borderRadius: '10px',
                            cursor: isUploading ? 'not-allowed' : 'pointer', 
                            opacity: isUploading ? 0.5 : 1
                        }}
                        onClick={handleBoxClick}
                    >
                        {!selectedFile ? (
                            <>
                                <CloudUploadIcon fontSize="large" style={{ color: 'white' }} />
                                <p style={{ fontSize: '20px', textAlign: 'center', wordBreak: 'break-word', wordSpacing: '2px', color: 'white' }}>Upload your CSV, Excel</p>
                            </>
                        ) : (
                            <Typography sx={{ fontSize: '20px', color: 'white' }}>{selectedFile.name}</Typography>
                        )}
                    </Box>
                    <input
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <Button
                        disableRipple
                        disableElevation
                        sx={{
                            backgroundColor: '#016FD0',
                            color: 'white',
                            mt: 2,
                            borderRadius: '20px',
                            height: "45px",
                            width: "250px",
                            pt: "7",
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#016FD0'
                            }
                        }}
                        onClick={handleFileUpload}
                    >
                        {isUploading ? (
                            <Box display="flex" alignItems="center">
                                <CircularProgress size={24} sx={{ color: 'white', marginRight: 1 }} />
                                <Typography sx={{ textTransform: 'none', color: 'white' }}>{message}</Typography>
                            </Box>
                        ) : (
                            <Typography sx={{ textTransform: 'none', color: 'white' }}>Upload</Typography>
                        )}
                    </Button>
                    {filePath && !newFileSelected && (
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" color="secondary" onClick={handleDownload} sx={{ borderRadius: '20px' }}>
                                Download AI Response
                            </Button>
                        </Box>
                    )}
                    {excelformat && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleExcelDownload}
                                sx={{ borderRadius: '20px' }}
                            >
                                Download Reference Excel
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default FileUploadComponent;
