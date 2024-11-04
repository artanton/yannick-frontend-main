import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PrivateRoutes, PublicRoutes } from './routes/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
     <Router>
      <PublicRoutes />
      <PrivateRoutes />
    </Router>
  </Elements>
   
  );
}

export default App;
