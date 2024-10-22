import React, { PropsWithChildren } from 'react';

type CommonContainerProps = PropsWithChildren<{ className?: string }>;

const CommonContainer: React.FC<CommonContainerProps> = ({
  className = '',
  children
}) => {
  return (
    <div className={`p-4 mx-2 mr-2 bg-white rounded-lg h-max ${className}`}>
      {children}
    </div>
  );
};

export default CommonContainer;
