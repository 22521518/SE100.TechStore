import { Box, Tooltip } from '@mui/material';
import React, { PropsWithChildren } from 'react';

type CommonToolTipProps = PropsWithChildren<{
  title: string;
  key?: string;
  className?: string;
}>;

const CommonToolTip: React.FC<CommonToolTipProps> = ({
  children,
  title,
  key,
  className
}) => {
  return (
    <Tooltip
      key={key}
      title={title}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -14]
              }
            }
          ]
        }
      }}
    >
      <Box className={className}>{children}</Box>
    </Tooltip>
  );
};

export default CommonToolTip;
