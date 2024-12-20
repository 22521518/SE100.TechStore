'use client';

import CommonContainer from '@components/common-container';
import { IDashboardData } from '@constant/interface.constant';
import { Box, Stack, Typography } from '@mui/material';
import { HttpError, useList } from '@refinedev/core';
import { transformVNMoney } from '@utils/transform.util';
import AirlineStopsOutlinedIcon from '@mui/icons-material/AirlineStopsOutlined';
import React from 'react';
import DashBoardStatCard from '@components/dashboard/stat-card/dashboard-stat-card';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const chartSetting = {
  width: 500,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)'
    }
  }
};

const DashBoard = () => {
  const { data, isLoading, isError } = useList<IDashboardData, HttpError>({
    resource: 'dashboard'
  });

  const [dashboardData, setDashboardData] =
    React.useState<IDashboardData | null>(
      data?.data ? (data.data as unknown as IDashboardData) : null
    );

  const totalRevenueThisYear = React.useMemo(() => {
    try {
      const yearRevenue = dashboardData?.revenueThisYear.reduce(
        (acc, cur) => (acc + cur.total_price ? Number(cur.total_price) : 0),
        0
      );

      return transformVNMoney(yearRevenue ?? 0);
    } catch (error) {
      return transformVNMoney(0);
    }
  }, [dashboardData]);

  const totalRevenueThisMonth = React.useMemo(() => {
    try {
      const today = new Date().getMonth();
      const monthRevenue = dashboardData?.revenueThisYear[today].total_price;

      return transformVNMoney(monthRevenue ?? 0);
    } catch (error) {
      return transformVNMoney(0);
    }
  }, [dashboardData]);

  // const stockAnalysisThisYear = React.useMemo(() => {
  //   try {
  //     return dashboardData?.inventoryStockAnalysisThisYear;
  //   } catch (error) {
  //     return [];
  //   }
  // }, [dashboardData]);

  const stockAnalysisThisMonth = React.useMemo(() => {
    try {
      const today = new Date().getMonth();
      return dashboardData?.inventoryStockAnalysisThisYear[today].data;
    } catch (error) {
      return [];
    }
  }, [dashboardData]);

  const totalCustomers = React.useMemo(() => {
    try {
      return dashboardData?.totalCustomers.length;
    } catch (error) {
      return 0;
    }
  }, [dashboardData]);

  const newCustomersThisMonth = React.useMemo(() => {
    try {
      return dashboardData?.newCustomerThisMonth.length;
    } catch (error) {
      return 0;
    }
  }, [dashboardData]);

  const revenueThisYearByMonth = React.useMemo(() => {
    try {
      return (
        dashboardData?.revenueThisYear.map((data, index) => {
          return { month: index + 1, total_price: data.total_price };
        }) || []
      );
    } catch (error) {
      return [];
    }
  }, [dashboardData]);

  const categoryRevenueThisMonth = React.useMemo(() => {
    try {
      return dashboardData?.revenueByCategoryThisMonth;
    } catch (error) {
      return [];
    }
  }, [dashboardData]);

  const topProductsThisMonth = React.useMemo(() => {
    try {
      return dashboardData?.revenueTopProductsThisMonth;
    } catch (error) {
      return [];
    }
  }, [dashboardData]);

  const topCustomerThisMonth = React.useMemo(() => {
    try {
      return dashboardData?.revenueByCustomerThisMonth;
    } catch (error) {
      return [];
    }
  }, [dashboardData]);

  const totalRevenueCategory = React.useMemo(() => {
    try {
      return dashboardData?.totalRevenueCategory;
    } catch (error) {
      return [];
    }
  }, [dashboardData]);

  const totalRevenueCustomer = React.useMemo(() => {
    try {
      return dashboardData?.totalRevenueCustomer;
    } catch (error) {
      return [];
    }
  }, [dashboardData]);

  const totalRevenueProduct = React.useMemo(() => {
    try {
      return dashboardData?.totalRevenueProduct;
    } catch (error) {
      return [];
    }
  }, [dashboardData]);

  React.useEffect(() => {
    setDashboardData(
      data?.data ? (data.data as unknown as IDashboardData) : null
    );
    console.log(data?.data);
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-4 mx-2 flex flex-col gap-4">
      <Box className="flex flex-row justify-between items-center">
        <Box className="flex flex-row items-center gap-2">
          <Typography variant="h5" className="font-bold text-3xl">
            Dashboard
          </Typography>
        </Box>
      </Box>
      <CommonContainer className="flex flex-col gap-4">
        <Box className="grid md:grid-cols-4 grid-cols-2 gap-2 justify-between my-2">
          <DashBoardStatCard
            title="Revenue This Year"
            value={totalRevenueThisYear}
            icon={<AirlineStopsOutlinedIcon />}
          />
          <DashBoardStatCard
            title="Revenue This Month"
            value={totalRevenueThisMonth}
            icon={<EditCalendarOutlinedIcon />}
          />
          <DashBoardStatCard
            title="Total Customers"
            value={totalCustomers?.toString() ?? '0'}
            icon={<AccessibilityNewOutlinedIcon />}
          />
          <DashBoardStatCard
            title="New Customers"
            value={newCustomersThisMonth?.toString() ?? '0'}
            icon={<AutorenewOutlinedIcon />}
          />
        </Box>

        <Box className="grid grid-cols-5 gap-2">
          <Box className="col-span-3 w-full overflow-visible">
            <Typography
              variant="h6"
              className="font-semibold place-self-center"
            >
              Revenue Analysis This Year
            </Typography>
            <BarChart
              xAxis={
                [
                  { scaleType: 'band', dataKey: 'month', label: 'Month' }
                ] as BarChartProps['xAxis']
              }
              dataset={revenueThisYearByMonth}
              series={[{ type: 'bar', dataKey: 'total_price' }]}
              {...chartSetting}
              className="w-full overflow-visible"
              colors={['#FFF5EE']}
            />
          </Box>

          <Stack className="col-span-2 items-center">
            <Typography variant="h6" className="font-semibold">
              Stock Analysis This Month
            </Typography>
            <Box className="bg-secondary-100 p-2 rounded-lg shadow-md">
              <Stack>
                <Box
                  className={`grid grid-cols-6 justify-between place-items-center gap-2 border-b-secondary-400 border-b-[1px] p-2`}
                >
                  <Typography className="col-span-3 font-bold">
                    Product Name
                  </Typography>
                  <Typography className="font-semibold">Imported</Typography>
                  <Typography className="font-semibold">Sold</Typography>
                  <Typography className="font-semibold">
                    Rate {`(%)`}
                  </Typography>
                </Box>
                {stockAnalysisThisMonth?.map((data, index) => (
                  <Box
                    key={index}
                    className={`grid grid-cols-6 justify-between place-items-center gap-2 border-b-secondary-400 ${
                      index < stockAnalysisThisMonth.length - 1
                        ? 'border-b-[1px]'
                        : ''
                    } p-2`}
                  >
                    <Typography className="col-span-3">
                      {data.product_name}
                    </Typography>
                    <Typography>{data.imported}</Typography>
                    <Typography>{data.sold}</Typography>
                    <Typography>{data.rate} %</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box className="grid md:grid-cols-2 gap-4">
          <Stack>
            <Typography variant="h6" className="font-semibold">
              Revenue By Category This Month
            </Typography>
            <Box className="bg-secondary-100 p-2 rounded-lg shadow-md">
              <Stack>
                {categoryRevenueThisMonth?.map((category, index) => (
                  <Box
                    key={index}
                    className={`grid grid-cols-7 justify-between items-center gap-2 border-b-secondary-400 ${
                      index < categoryRevenueThisMonth.length - 1
                        ? 'border-b-[1px]'
                        : ''
                    } p-2`}
                  >
                    <Typography>{index + 1}</Typography>
                    <Typography className="col-span-3">
                      {category.category_name}
                    </Typography>
                    <Typography className="col-span-3">
                      {transformVNMoney(category.total_price)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Stack>
            <Typography variant="h6" className="font-semibold">
              Total Revenue By Category
            </Typography>
            <Box className="bg-secondary-100 p-2 rounded-lg shadow-md">
              <Stack>
                {totalRevenueCategory?.map((category, index) => (
                  <Box
                    key={index}
                    className={`grid grid-cols-7 justify-between items-center gap-2 border-b-secondary-400 ${
                      index < totalRevenueCategory.length - 1
                        ? 'border-b-[1px]'
                        : ''
                    } p-2`}
                  >
                    <Typography>{index + 1}</Typography>
                    <Typography className="col-span-3">
                      {category.category_name}
                    </Typography>
                    <Typography className="col-span-3">
                      {transformVNMoney(category.total_price)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Stack>
            <Typography variant="h6" className="font-semibold">
              Revenue By Products This Month
            </Typography>
            <Box className="bg-secondary-100 p-2 rounded-lg shadow-md">
              <Stack>
                {topProductsThisMonth?.map((product, index) => (
                  <Box
                    key={index}
                    className={`grid grid-cols-7 justify-between items-center gap-2 border-b-secondary-400 ${
                      index < topProductsThisMonth.length - 1
                        ? 'border-b-[1px]'
                        : ''
                    } p-2`}
                  >
                    <Typography>{index + 1}</Typography>
                    <Typography className="col-span-3">
                      {product.product_name}
                    </Typography>
                    <Typography className="col-span-3">
                      {transformVNMoney(product.total_price)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Stack>
            <Typography variant="h6" className="font-semibold">
              Total Revenue By Products
            </Typography>
            <Box className="bg-secondary-100 p-2 rounded-lg shadow-md">
              <Stack>
                {totalRevenueProduct?.map((product, index) => (
                  <Box
                    key={index}
                    className={`grid grid-cols-7 justify-between items-center gap-2 border-b-secondary-400 ${
                      index < totalRevenueProduct.length - 1
                        ? 'border-b-[1px]'
                        : ''
                    } p-2`}
                  >
                    <Typography>{index + 1}</Typography>
                    <Typography className="col-span-3">
                      {product.product_name}
                    </Typography>
                    <Typography className="col-span-3">
                      {transformVNMoney(product.total_price)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Stack className="">
            <Typography variant="h6" className="font-semibold">
              Revenue By Customer This Month
            </Typography>
            <Box className="bg-secondary-100 p-2 rounded-lg shadow-md">
              <Stack>
                {topCustomerThisMonth?.map((customer, index) => (
                  <Box
                    key={index}
                    className={`grid grid-cols-7 justify-between items-center gap-2 border-b-secondary-400 ${
                      index < topCustomerThisMonth.length - 1
                        ? 'border-b-[1px]'
                        : ''
                    } p-2`}
                  >
                    <Typography>{index + 1}</Typography>
                    <Typography className="col-span-3">
                      {customer.username}
                    </Typography>
                    <Typography className="col-span-3">
                      {transformVNMoney(customer.total_price)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Stack className="">
            <Typography variant="h6" className="font-semibold">
              Total Revenue By Customer
            </Typography>
            <Box className="bg-secondary-100 p-2 rounded-lg shadow-md">
              <Stack>
                {totalRevenueCustomer?.map((customer, index) => (
                  <Box
                    key={index}
                    className={`grid grid-cols-7 justify-between items-center gap-2 border-b-secondary-400 ${
                      index < totalRevenueCustomer.length - 1
                        ? 'border-b-[1px]'
                        : ''
                    } p-2`}
                  >
                    <Typography>{index + 1}</Typography>
                    <Typography className="col-span-3">
                      {customer.username}
                    </Typography>
                    <Typography className="col-span-3">
                      {transformVNMoney(customer.total_price)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </CommonContainer>
    </div>
  );
};

export default DashBoard;
