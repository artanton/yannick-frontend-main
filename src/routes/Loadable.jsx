import React, { Suspense } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loadable = (Component) => (props) => (
    <Suspense
        fallback={
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        }
    >
        <Component {...props} />
    </Suspense>
);

export default Loadable;
