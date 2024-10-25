import React, { PropsWithChildren } from 'react';

type CommonContainerProps = PropsWithChildren<{
  className?: string;
  isModal?: boolean;
}>;

const CommonContainer: React.FC<CommonContainerProps> = ({
  className = '',
  isModal = false,
  children
}) => {
  return (
    <div
      className={`p-4 mx-2 mr-2 min-h-max h-max ${
        isModal ? 'bg-white' : 'bg-primary-200'
      } rounded-lg h-max shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default CommonContainer;
