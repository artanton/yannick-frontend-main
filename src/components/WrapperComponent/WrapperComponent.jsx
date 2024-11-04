import React from 'react';
import backgroundImage from '../../assets/images/background.webp'; 
export const WrapperComponent = ({ children }) => {
    const style = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        height: '100vh', 
        width: '100vw'  
    };

    return (
        <div style={style}>
            {children}
        </div>
    );
};
