'use client';

import { IProductFeedback } from '@constant/interface.constant';
import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { transformDate } from '@utils/transform.util';

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
    <Box className="flex flex-row justify-between px-8 py-5 bg-white rounded-lg">
      <DataGrid
        columns={columns}
        rows={feedbacklist}
        getRowId={(row: IProductFeedback) => row.feedback_id}
        sx={{
          color: 'black',
          '& .MuiDataGrid-row': {
            '&:nth-of-type(odd)': {
              backgroundColor: 'rgba(0,0,0,0.04)'
            }
          }
        }}
        className="text-accent my-4"
      />
    </Box>
  );
};

export default ProductFeedbackList;
