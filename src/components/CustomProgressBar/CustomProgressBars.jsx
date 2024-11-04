import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomProgressBars.css'
const CustomProgressBars = ({ progress1, progress2, progress3 }) => {
    return (

        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }} className='steps'>
                <span style={{ alignSelf: 'flex-start', color: 'white', marginBottom: '5px' }}>Step 1</span>
                <ProgressBar
                    now={progress1}
                    value={progress1}
                    label={`${progress1}%`}
                    visuallyHidden
                    style={{ width: '100%', height: '6px', background: "#A5C2C5" }}
                    variant="SOME_NAME"
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }} className='steps'>
                <span style={{ alignSelf: 'flex-start', color: 'white', marginBottom: '5px' }}>Step 2</span>
                <ProgressBar
                    now={progress2}
                    label={`${progress2}%`}
                    visuallyHidden
                    style={{ width: '100%', height: '6px', background: "#A5C2C5" }}
                    variant="SOME_NAME"
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }} className='steps'>
                <span style={{ alignSelf: 'flex-start', color: 'white', marginBottom: '5px' }}>Step 3</span>
                <ProgressBar
                    now={progress3}
                    label={`${progress3}%`}
                    visuallyHidden
                    style={{ width: '100%', height: '6px', background: "#A5C2C5" }}
                    variant="SOME_NAME"
                />
            </div>
        </>




    );
}

export default CustomProgressBars;
