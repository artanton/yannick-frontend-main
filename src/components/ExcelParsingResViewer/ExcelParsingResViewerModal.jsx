import React, { useState, useEffect ,useRef} from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Checkbox, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateExcel } from '../../api/excelfile';
import Sidebar from '../SideBar/Sidebar';
import './ExcelParsingResViewerModal.css';
import downloadImg from '../../assets/images/Download.png';
import { NotificationBadge } from '../Notification/Notification';
import useNotificationStore from '../../stores/notification.store';



const messages = [
    'Uploading your plan',
    'Plan uploaded',
    'Analyzing your plan',
    'Waiting for response',
    'This may take some time'
];

export default function ExcelParsingResViewerModal({ excelResponse }) {
    const [loader, setLoader] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [message, setMessage] = useState(messages[0]);
    const [looped, setLooped] = useState(false);
    const { notificationBadge, setNotificationBadge } = useNotificationStore(state => ({
        notificationBadge: state.notificationBadge,
        setNotificationBadge: state.setNotificationBadge
    }));

    const handleToggleChecked = (item) => () => {
        const currentIndex = checkedItems.indexOf(item);
        const newChecked = [...checkedItems];

        if (currentIndex === -1) {
            newChecked.push(item);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setCheckedItems(newChecked);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setCheckedItems([]);
        } else {
            setCheckedItems(excelResponse?.finalResult?.missing_activity || []);
        }
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        if (!loader) return;
        if (looped) return;

        const interval = setInterval(() => {
            setMessage((prev) => {
                const currentIndex = messages.indexOf(prev);
                if (currentIndex === messages.length - 1) {
                    setLooped(true);
                    clearInterval(interval);
                    return messages[messages.length - 1];
                }
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 7000);

        return () => clearInterval(interval);
    }, [looped, loader]);

    const addToExcel = async () => {
        setLoader(true);

        const { missing_activity, activitiesList } = excelResponse?.finalResult;
        if (checkedItems && activitiesList) {
            const resp = await updateExcel({ activitiesList: activitiesList, missingActivities: checkedItems });
            if (resp?.status && resp?.fileName) {
                setNotificationBadge({
                    showNotification: true,
                    isSuccess: true,
                    message: "Plan Successfully Updated !!"
                  });
                window.open(`${process.env.REACT_APP_BACKEND_URL_API}${resp?.fileName}`, "_blank");
            }else{
                setNotificationBadge({
                    showNotification: true,
                    isSuccess: false,
                    message:"Something went wrong !"
                  });
            }
        }
        setLoader(false);
    };

    const downloadExcel = () => {
        if (excelResponse?.finalResult?.filePath) {
            window.open(`${process.env.REACT_APP_BACKEND_URL_API}${excelResponse?.finalResult?.filePath}`);
        }
        setCheckedItems([]);
        setSelectAll(false);
    };

    return (
        <div className="d-flex justify-content-between" style={{ backgroundImage: 'none !important' }}>
            {notificationBadge?.showNotification && <NotificationBadge notificationBadge={notificationBadge} setNotificationBadge={setNotificationBadge} />}
            <Sidebar />
            <div style={{ padding: '20px', width: "100%" }}>
                    <div className="title-container">
                        <h1 className='title-container-main'>Plan Analysis</h1>
                        <p>Review the AI-generated analysis of your plan, including strengths, weaknesses, opportunities, and threats.</p>
                    </div>
                <Box
                    sx={{
                        backgroundColor: '#3D7B82',
                        position: 'relative',
                        padding: '20px',
                        overflowY: 'auto',
                        // maxHeight: '80vh',
                        // maxWidth: '37rem',
                        margin: '0 auto',
                        marginTop: '2rem',
                        borderRadius: '8px',
                    }}
                >
                    <Box padding="24px" display="flex" flexDirection="column" justifyContent="center" backgroundColor='#DEFBFF'>
                        <Typography
                            alignSelf="center"
                            variant="h6"
                            component="h2"
                            className = "upload-content-heading" 
                            sx={{ color: '#44CEE3 !important' }}
                        >
                            <span style={{ marginRight: '15px' }}>
                                {`Strength Scale : ${(excelResponse?.finalResult?.strength_count).toFixed(2)}%`}
                            </span>
                            <span>
                                {(() => {
                                    const strength = excelResponse?.finalResult?.strength_count;
                                    if (strength < 25) return "Very Weak";
                                    if (strength >= 25 && strength <= 49) return "Weak";
                                    if (strength >= 50 && strength <= 74) return "Strong";
                                    if (strength >= 75) return "Very Strong";
                                })()}
                            </span>
                        </Typography>
                        {excelResponse?.finalResult?.missing_activity?.length > 0 && (
                            <ActivityList
                                data={excelResponse?.finalResult?.missing_activity}
                                checkedItems={checkedItems}
                                handleToggleChecked={handleToggleChecked}
                                selectAll={selectAll}
                                handleSelectAll={handleSelectAll}
                            />
                        )}
                        <Box display="flex" justifyContent="center" mt={2}>
                            {excelResponse?.finalResult?.missing_activity?.length > 0 && (
                                <Button
                                alignSelf="center"
                                variant="contained"
                                onClick={addToExcel}
                                disabled={loader}
                                className="excel-custom-button"
                                
                            >
                                {loader ? (
                                    <Box display="flex" flexDirection="row" gap={1}>
                                        <CircularProgress size={24} color="inherit" />
                                        <Typography sx={{ textTransform: 'none' }}>
                                            {message}
                                        </Typography>
                                    </Box>
                                ) : (
                                    'Add these to my Plan'
                                )}
                            </Button>
                            
                            )}
                            {excelResponse?.finalResult?.filePath && (
                                <Tooltip title='"Download file" will upgrade your existing plan with some changes.' placement="bottom">
                                    <Button
                                        width="15rem"
                                        sx={{ marginLeft: "1rem" }}
                                        alignSelf="center"
                                        variant="contained"
                                        onClick={downloadExcel}
                                        className="excel-custom-button"
                                    >   
                                    <img src={downloadImg} alt="Icon" className="button-icon" />
                                        Download File
                                    </Button>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                </Box>
            </div>
        </div>

    );
}

const ActivityList = ({ data, checkedItems, handleToggleChecked, selectAll, handleSelectAll }) => {
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [data.length]); // This will run when the length of the data array changes

    return (
        <Box overflow="scroll" height="500px"> {/* You can adjust the height */}
            <Typography mt={2} variant="h6" component="h2">
                {`By adding below mentioned points your strength can be 100%`}
            </Typography>
            <List>
                <ListItem>
                    <Checkbox
                        edge="start"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        tabIndex={-1}
                        disableRipple
                        sx={{
                            width: '22px !important',
                            height: '22px !important',
                            borderRadius: '4px !important',
                            border: '1px solid #DEE9EB !important',
                            opacity: '1 !important',
                            padding: '0px !important',
                            '&.Mui-checked': {
                                borderColor: '#DEE9EB !important',
                            },
                        }}
                    />
                    <ListItemText primary="Select All" sx={{ color: '#1976d2', fontWeight: "bold" }} />
                </ListItem>
                {data.map((item, index) => (
                    <ListItem key={index} ref={listRef}>
                        <Checkbox
                            edge="start"
                            checked={checkedItems.indexOf(item) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': `checkbox-list-label-${index}` }}
                            onChange={handleToggleChecked(item)}
                            sx={{
                                width: '18px !important',
                                height: '18px !important',
                                gap: '0px',
                                borderRadius: '4px',
                                border: '1px solid #DEE9EB !important',
                                opacity: 1,
                                '&.Mui-checked': {
                                    color: '#63ECFC !important',
                                    borderColor: '#DEE9EB !important',
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: '18px',
                                },
                            }}
                        />
                        <ListItemText  className="custom-list-item-text" id={`checkbox-list-label-${index}`} primary={item.Activity} 
                         />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
