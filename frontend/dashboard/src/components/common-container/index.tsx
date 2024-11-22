import React, { PropsWithChildren } from 'react';

type CommonContainerProps = PropsWithChildren<{
  className?: string;
  isModal?: boolean;
  heightMin?: boolean;
  heightMax?: boolean;
}>;

const CommonContainer: React.FC<CommonContainerProps> = ({
  className = '',
  isModal = false,
  children,
  heightMin = true,
  heightMax = true
}) => {
  return (
    <div
      className={`p-4 mx-2 mr-2 ${heightMin ? 'min-h-max' : ''} ${
        heightMax ? 'h-max' : ''
      } ${
        isModal
          ? 'bg-white'
          : 'bg-primary-200 border-2 border-solid border-white border-opacity-50 '
      } rounded-lg h-max shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default CommonContainer;
