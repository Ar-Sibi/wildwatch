// src/components/CardBody.tsx
import React from 'react';

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 m-4 hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default CardBody;