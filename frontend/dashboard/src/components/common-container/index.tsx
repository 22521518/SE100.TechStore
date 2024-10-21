import React, { PropsWithChildren } from 'react';

const CommonContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="py-6 bg-white rounded-lg px-4">{children}</div>;
};

export default CommonContainer;
