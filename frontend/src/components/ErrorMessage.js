import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="erro">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
