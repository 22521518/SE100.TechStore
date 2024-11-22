'use client';

import { IProductFeedback } from '@constant/interface.constant';
import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { transformDate } from '@utils/transform.util';
import CommonContainer from '@components/common-container';

type ProductFeedbackListProps = {
  feedbacklist: IProductFeedback[];
};

const ProductFeedbackList = ({ feedbacklist }: ProductFeedbackListProps) => {
  const columns = React.useMemo<GridColDef<IProductFeedback>[]>(
    () => [
      {
        field: 'customer_id',
        headerName: 'CUSTOMER ID',
        type: 'string',
        flex: 3
      },
      {
        field: 'rating',
        headerName: 'Rates',
        flex: 1,
        renderCell: ({ value }) => {
          return (
            <Box className="flex items-center justify-center h-full">
              <Typography className="text-sm">{value}</Typography>
              <StarIcon sx={{ color: '#ffcc00', marginLeft: '4px' }} />
            </Box>
          );
        }
      },
      {
        field: 'feedback',
        headerName: 'Feedback',
        flex: 4
      },
      {
        field: 'created_at',
        headerName: 'Date',
        flex: 2,
        renderCell: ({ row }) => {
          const date = new Date(row.created_at);
          return <span>{transformDate(date.toISOString(), true)}</span>;
        }
      }
    ],
    []
  );

  return (
    <CommonContainer className="flex flex-row items-center justify-between">
      <DataGrid
        columns={columns}
        rows={feedbacklist}
        getRowId={(row: IProductFeedback) => row.feedback_id}
        sx={{
          '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]':
            {
              backgroundColor: 'transparent !important',
              color: 'black'
            }
        }}
        className="text-accent my-4 bg-transparent"
      />
    </CommonContainer>
  );
};

export default ProductFeedbackList;
