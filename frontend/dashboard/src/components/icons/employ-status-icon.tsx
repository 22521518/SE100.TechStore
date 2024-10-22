'use client';

import { EMPLOY_STATUS } from '@constant/enum.constant';
import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

type EmployStatusIconProps = {
  status: EMPLOY_STATUS | undefined;
};

const EmployStatusIcon = ({ status }: EmployStatusIconProps) => {
  switch (status) {
    case EMPLOY_STATUS.ACTIVE:
      return <CheckCircleOutlineIcon />;
    case EMPLOY_STATUS.INACTIVE:
      return <CancelOutlinedIcon />;
    case EMPLOY_STATUS.SUSPENDED:
      return <BlockOutlinedIcon />;
    case EMPLOY_STATUS.RESIGNED:
      return <ExitToAppOutlinedIcon />;
    default:
      return null;
  }
};

export default EmployStatusIcon;
