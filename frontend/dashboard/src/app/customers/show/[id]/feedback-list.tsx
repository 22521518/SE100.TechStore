'use client';

import CommonContainer from '@components/common-container';
import { IProductFeedback } from '@constant/interface.constant';
import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

type CustomerFeedbackListProps = {
  feedbackList: IProductFeedback[];
};

const CustomerFeedbackList = ({ feedbackList }: CustomerFeedbackListProps) => {
  const columns = React.useMemo<GridColDef<IProductFeedback>[]>(
    () => [
      {
        field: 'product_id',
        headerName: 'Product ID',
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
              <StarIcon sx={{ color: '#ffcc00', marginLeft: '1px' }} />
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
          const formattedDate = date.toLocaleDateString('en-US');
          return <span>{formattedDate}</span>;
        }
      }
    ],
    []
  );

  return (
    <CommonContainer className="flex-1">
      <Box className="flex flex-row justify-between">
        <Box className="flex flex-row gap-1">
          <RateReviewOutlinedIcon />
          <Typography variant="h4" className="font-bold text-xl">
            Feedbacks
          </Typography>
        </Box>
        <Typography variant="h4" className="font-semibold text-lg text-black">
          Total {feedbackList.length} feedbacks
        </Typography>
      </Box>
      <DataGrid
        columns={columns}
        rows={feedbackList}
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
    </CommonContainer>
  );
};

export default CustomerFeedbackList;
