import React from 'react';
import { WrapperComponent } from '../components/WrapperComponent/WrapperComponent';

const PublicRoute = ({ element, ...rest }) => {
  return (
    <WrapperComponent>
      {element}
    </WrapperComponent>
  );
};

export default PublicRoute;
