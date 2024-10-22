import React, { PropsWithChildren } from 'react';

const CommonContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="py-6 mr-2 bg-white rounded-lg px-4 flex-1 h-max">
      {children}
    </div>
  );
};

export default CommonContainer;
