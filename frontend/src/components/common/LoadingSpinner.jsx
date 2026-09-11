import React from 'react';
import KineticLoader from './KineticLoader';

const LoadingSpinner = ({ message = 'Loading TaskFlow...' }) => {
  return <KineticLoader size="medium" text={message} />;
};

export default LoadingSpinner;
