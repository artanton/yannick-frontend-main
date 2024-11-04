import React from 'react'
import { ProgressBar } from 'react-bootstrap';
import './CustomProgress.css'
const CustomProgress = ({progress}) => {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                
                <ProgressBar
                    now={progress}
                    label={`${progress}%`}
                    visuallyHidden
                    style={{ width: '100%', height: '6px', background:"#A5C2C5" }}
                    variant="SOME_NAME"
                />
            </div>
        </>
    )
}

export default CustomProgress