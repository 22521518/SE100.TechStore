import { IProductFeedback } from '@constant/constant.interface';
import StarIcon from '@mui/icons-material/Star';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import React from 'react';

type ProductSatisticsProps = {
  feedbackList: IProductFeedback[];
};

const ProductSatistics = ({ feedbackList }: ProductSatisticsProps) => {
  const totalReviews = feedbackList.length;

  // Calculate average rating
  const averageRating =
    feedbackList.reduce((acc, feedback) => acc + feedback.rating, 0) /
    totalReviews;

  // Count ratings distribution
  const ratingDistribution = Array(5).fill(0);
  feedbackList.forEach((feedback) => {
    ratingDistribution[feedback.rating - 1]++;
  });

  return (
    <>
      <Stack className="md:hidden lg:flex flex-col min-w-max w-72 gap-1">
        <Box className="flex flex-row gap-4 items-center py-2 ">
          <Typography variant="h6" className="text-5xl text-star font-bold">
            {averageRating.toFixed(1)} / 5
          </Typography>
          <StarIcon className="text-5xl text-star" />
        </Box>
        <Typography variant="h6" className="text-slate-400 text-2xl">
          from {totalReviews} reviews{' '}
        </Typography>
        {ratingDistribution.reverse().map((count, index) => {
          const rating = 5 - index;
          const percentage = (count / totalReviews) * 100;

          return (
            <Box
              key={index}
              className="w-full min-w-max  flex items-center gap-4"
            >
              <Box className="flex flex-row gap-1 items-center ">
                <Typography className="text-star">{rating}</Typography>
                <StarIcon className=" text-star" />
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                className="w-full text-star h-2 rounded-full bg-transparent"
                sx={{
                  background: 'transparent',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ca8a04'
                  }
                }}
              />
              <Typography>{count}</Typography>
            </Box>
          );
        })}
      </Stack>
    </>
  );
};

export default ProductSatistics;
