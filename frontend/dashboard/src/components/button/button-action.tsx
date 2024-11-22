import { Button } from '@mui/material';
import React from 'react';

type ButtonActionProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
};

const ButtonAction = ({
  children,
  onClick,
  className,
  disabled,
  type,
  id
}: ButtonActionProps) => {
  return (
    <>
      <Button
        id={id}
        className={`gap-2 bg-accent text-white py-2.5 px-4 min-w-max border-solid border-2 border-white outline-2 outline-accent outline ${className}`}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
    </>
  );
};

export default ButtonAction;
