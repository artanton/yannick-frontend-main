import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Loadable from './Loadable';
import useUserStore from '../stores/useUserStore'


const Admin = Loadable(React.lazy(() => import('../components/Admin/Admin')));
const UploadFile = Loadable(React.lazy(() => import('../components/UploadFile/UploadFile')));
const UpgradePlan = Loadable(React.lazy(() => import('../components/UpgradePlan/UpgradePlan')));
const SignIn = Loadable(React.lazy(() => import('../components/SignIn/SignIn')));
const ForgotPassword = Loadable(React.lazy(() => import('../components/ForgotPasword/ForgotPassword')));
const SignUp = Loadable(React.lazy(() => import('../components/SignUpCustomer/SignUp')));
const Payment = Loadable(React.lazy(() => import('../components/Payment/Payment')));
const CreatePlan = Loadable(React.lazy(() => import('../components/Plan/CreatePlan')));
const AnalyzePlan = Loadable(React.lazy(() => import('../components/Plan/AnalyzePlan')));
const SubscriptionPlan = Loadable(React.lazy(() => import('../components/SubscriptionPlan/SubscriptionPlan')));
const CreatePassword = Loadable(React.lazy(() => import('../components/CreatePassword/CreatePassword'))); 
const MyPlan = Loadable(React.lazy(() => import('../components/MyPlan/MyPlan')));  
const PlanDetails = Loadable(React.lazy(() => import('../components/PlanDetails/PlanDetails'))); 

export const PublicRoutes = () => (

    
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<PublicRoute element={<SignIn />} />} />
        <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
        <Route path="/upload-file" element={<PublicRoute element={<UploadFile />} />} />
        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
        <Route path="/payment" element={<PublicRoute element={<Payment />} />} />
        <Route path="/subscription" element={<PublicRoute element={<SubscriptionPlan />} />} />
        <Route path="/reset-password" element={<PublicRoute element={<CreatePassword />} />} />
        
    </Routes>
);
export const PrivateRoutes = () => (
    <Routes>

        <Route path="admin" element={<PrivateRoute element={<Admin />} />} />
        {/* <Route path="create-plan" element={<PrivateRoute element={<CreatePlan />} />} /> */}
        <Route path="create-plan/:id?" element={<PrivateRoute element={<CreatePlan />} />} />
        <Route path="analyze-plan" element={<PrivateRoute element={<AnalyzePlan />} />} />
        <Route path="upgrade-plan" element={<PrivateRoute element={<UpgradePlan />} />} />
        <Route path="my-plans" element={<PrivateRoute element={<MyPlan />} />} />
        <Route path="plan-details" element={<PrivateRoute element={<PlanDetails />} />} />

    </Routes>
);