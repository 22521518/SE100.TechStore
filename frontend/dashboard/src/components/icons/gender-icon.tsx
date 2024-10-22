'use client';

import React from 'react';
import Face3OutlinedIcon from '@mui/icons-material/Face3Outlined';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';

type GenderIconProps = {
  male: boolean;
};

const GenderIcon = ({ male }: GenderIconProps) => {
  return <>{male ? <FaceOutlinedIcon /> : <Face3OutlinedIcon />}</>;
};

export default GenderIcon;
