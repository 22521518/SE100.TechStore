import { Injectable } from '@nestjs/common';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class DashboardService {
  private readonly releaseDate = new Date('2024-01-01');
  private readonly releaseYear = 2024;
  private readonly releaseMonth = 1;

  constructor(private readonly prismaDbService: PrismaDbService) {}

  async GetCustomerByDate(month: number = 1, year: number = 2024) {
    try {
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(
        Date.UTC(year + (month === 12 ? 1 : 0), month % 12, 1),
      );
      return await this.prismaDbService.customers.findMany({
        where: {
          AND: [
            {
              date_joined: {
                gte: startDate,
              },
            },
            {
              date_joined: {
                lt: endDate,
              },
            },
          ],
        },
      });
    } catch {
      throw new Error('Failed to get customer data');
    }
  }

  async GetCustomerByYear(year: number = 2024) {
    try {
      return await this.prismaDbService.customers.findMany({
        where: {
          AND: [
            {
              date_joined: {
                gte: new Date(year, 1, 1),
              },
            },
            {
              date_joined: {
                lt: new Date(year + 1, 1, 1),
              },
            },
          ],
        },
      });
    } catch {
      throw new Error('Failed to get customer data');
    }
  }

  async GetTotalCustomer() {
    try {
      return await this.prismaDbService.customers.findMany();
    } catch {
      throw new Error('Failed to get total customer data');
    }
  }

  async GetRevenueByDate(month: number = 1, year: number = 2024) {
    try {
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(
        Date.UTC(year + (month === 12 ? 1 : 0), month % 12, 1),
      );

      const orders = await this.prismaDbService.orders.findMany({
        where: {
          AND: [
            {
              created_at: {
                gte: startDate,
              },
            },
            {
              created_at: {
                lt: endDate,
              },
            },
          ],
        },
        select: {
          total_price: true,
          created_at: true,
        },
      });
      return {
        total_price: orders.reduce(
          (acc, order) =>
            acc + (order.total_price ? Number(order.total_price) : 0),
          0,
        ),
      };
    } catch {
      throw new Error('Failed to get revenue data by date');
    }
  }

  async GetRevenueCustomerByDate(
    month: number = 1,
    year: number = 2024,
    top?: number,
  ) {
    try {
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(
        Date.UTC(year + (month === 12 ? 1 : 0), month % 12, 1),
      );

      const slice = top ? top : await this.prismaDbService.customers.count();

      const orders = await this.prismaDbService.orders.findMany({
        where: {
          AND: [
            {
              created_at: {
                gte: startDate,
              },
            },
            {
              created_at: {
                lt: endDate,
              },
            },
          ],
        },
        select: {
          total_price: true,
          customer: true,
        },
      });

      const revenueByCustomerMap = new Map<any, number>();
      orders.forEach((order) => {
        const { total_price, customer } = order;
        const { username } = customer;
        if (revenueByCustomerMap.has(username)) {
          revenueByCustomerMap.set(
            username,
            revenueByCustomerMap.get(username) + Number(total_price),
          );
        } else {
          revenueByCustomerMap.set(username, Number(total_price));
        }
      });

      const revenueByCustomerArray = Array.from(revenueByCustomerMap).map(
        ([username, total_price]) => ({
          username,
          total_price,
        }),
      );

      return revenueByCustomerArray
        .sort((a, b) => b.total_price - a.total_price)
        .slice(0, slice);
    } catch {
      throw new Error('Failed to get revenue customer data by date');
    }
  }

  async GetRevenueByYear(year: number = 2024) {
    const startDate = new Date(Date.UTC(year, 1, 1));
    const endDate = new Date(Date.UTC(year + 1, 1));
    try {
      const orders = await this.prismaDbService.orders.findMany({
        where: {
          AND: [
            {
              created_at: {
                gte: startDate,
              },
            },
            {
              created_at: {
                lt: endDate,
              },
            },
          ],
        },
        select: {
          total_price: true,
        },
      });

      return {
        total_price: orders.reduce(
          (acc, order) => acc + Number(order.total_price),
          0,
        ),
      };
    } catch {
      throw new Error('Failed to get revenue data by year');
    }
  }

  async GetRevenueByCategoryByDate(month: number = 1, year: number = 2024) {
    try {
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(
        Date.UTC(year + (month === 12 ? 1 : 0), month % 12, 1),
      );

      const orderItems = await this.prismaDbService.order_Items.findMany({
        where: {
          AND: [
            {
              order: {
                created_at: {
                  gte: startDate,
                },
              },
            },
            {
              order: {
                created_at: {
                  lt: endDate,
                },
              },
            },
          ],
        },
        select: {
          product: {
            select: {
              categories: true,
            },
          },
          total_price: true,
        },
      });

      const revenueByCategoryMap = new Map<any, number>();

      // Aggregate the total price by category
      orderItems.forEach((orderItem) => {
        const categories = orderItem.product.categories;
        const totalPrice = Number(orderItem.total_price);

        categories.forEach((category) => {
          const { category_name } = category;
          if (revenueByCategoryMap.has(category_name)) {
            revenueByCategoryMap.set(
              category_name,
              revenueByCategoryMap.get(category_name) + totalPrice,
            );
          } else {
            revenueByCategoryMap.set(category_name, totalPrice);
          }
        });
      });

      // Convert map to array of categories with total revenue
      const revenueByCategoryArray = Array.from(revenueByCategoryMap).map(
        ([category_name, total_price]) => ({
          category_name,
          total_price,
        }),
      );

      return revenueByCategoryArray.sort(
        (a, b) => b.total_price - a.total_price,
      );
    } catch {
      throw new Error('Failed to get revenue category data by date');
    }
  }

  async GetRevenueByCategoryByYear(year: number = 2024) {
    try {
      return await this.prismaDbService.order_Items.findMany({
        where: {
          AND: [
            {
              order: {
                created_at: {
                  gte: new Date(Date.UTC(year, 1, 1)),
                },
              },
            },
            {
              order: {
                created_at: {
                  lt: new Date(Date.UTC(year + 1, 1, 1)),
                },
              },
            },
          ],
        },
        select: {
          product: {
            select: {
              categories: true,
            },
          },
          total_price: true,
        },
      });
    } catch {
      throw new Error('Failed to get revenue category data by year');
    }
    {
      throw new Error('Failed to get revenue category data by year');
    }
  }

  async GetRevenueByProductByDate(month: number = 1, year: number = 2024) {
    try {
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(
        Date.UTC(year + (month === 12 ? 1 : 0), month % 12, 1),
      );

      return await this.prismaDbService.order_Items.findMany({
        where: {
          AND: [
            {
              order: {
                created_at: {
                  gte: startDate,
                },
              },
            },
            {
              order: {
                created_at: {
                  lt: endDate,
                },
              },
            },
          ],
        },
        select: {
          product: true,
          total_price: true,
        },
      });
    } catch {
      throw new Error('Failed to get revenue data');
    }
  }

  async GetRevenueByProductByYear(year: number = 2024) {
    try {
      const startDate = new Date(Date.UTC(year, 1, 1));
      const endDate = new Date(Date.UTC(year + 1, 1, 1));

      return await this.prismaDbService.order_Items.findMany({
        where: {
          AND: [
            {
              order: {
                created_at: {
                  gte: startDate,
                },
              },
            },
            {
              order: {
                created_at: {
                  lt: endDate,
                },
              },
            },
          ],
        },
        select: {
          product: true,
          total_price: true,
        },
      });
    } catch {
      throw new Error('Failed to get revenue data');
    }
  }

  async GetRevenueTopProductsByDate(
    month: number,
    year: number,
    top: number = 5,
  ) {
    try {
      const revenueByProduct = await this.GetRevenueByProductByDate(
        month,
        year,
      );
      const revenueByProductMap = new Map<any, number>();
      revenueByProduct.forEach((item) => {
        const { product, total_price } = item;
        const { product_name } = product;
        if (revenueByProductMap.has(product_name)) {
          revenueByProductMap.set(
            product_name,
            revenueByProductMap.get(product_name) + Number(total_price),
          );
        } else {
          revenueByProductMap.set(product_name, Number(total_price));
        }
      });

      const revenueByProductArray = Array.from(revenueByProductMap).map(
        ([product_name, total_price]) => ({
          product_name,
          total_price,
        }),
      );

      return revenueByProductArray
        .sort((a, b) => b.total_price - a.total_price)
        .slice(0, top);
    } catch {
      throw new Error('Failed to get top revenue products by date');
    }
  }

  async GetTotalRevenueCategory(top: number = 5) {
    try {
      const orderItems = await this.prismaDbService.order_Items.findMany({
        select: {
          product: {
            select: {
              categories: true,
            },
          },
          total_price: true,
        },
      });

      // Create a map to store revenue by category
      const revenueByCategoryMap = new Map<any, number>();

      // Aggregate the total price by category
      orderItems.forEach((orderItem) => {
        const categories = orderItem.product.categories;
        const totalPrice = Number(orderItem.total_price);

        categories.forEach((category) => {
          const { category_name } = category;
          if (revenueByCategoryMap.has(category_name)) {
            revenueByCategoryMap.set(
              category_name,
              revenueByCategoryMap.get(category_name) + totalPrice,
            );
          } else {
            revenueByCategoryMap.set(category_name, totalPrice);
          }
        });
      });

      // Convert map to array of categories with total revenue
      const revenueByCategoryArray = Array.from(revenueByCategoryMap).map(
        ([category_name, total_price]) => ({
          category_name,
          total_price,
        }),
      );

      // Sort by total price and get the top categories
      return revenueByCategoryArray
        .sort((a, b) => b.total_price - a.total_price)
        .slice(0, top);
    } catch (error) {
      console.error('Error fetching revenue by category:', error);
      throw new Error('Failed to get revenue category data');
    }
  }

  async GetTotalRevenueCustomer(top: number = 5) {
    try {
      const orders = await this.prismaDbService.orders.findMany({
        select: {
          total_price: true,
          customer: true,
        },
      });

      const revenueByCustomerMap = new Map<any, number>();
      orders.forEach((order) => {
        const { total_price, customer } = order;
        const { username } = customer;
        if (revenueByCustomerMap.has(username)) {
          revenueByCustomerMap.set(
            username,
            revenueByCustomerMap.get(username) + Number(total_price),
          );
        } else {
          revenueByCustomerMap.set(username, Number(total_price));
        }
      });

      const revenueByCustomerArray = Array.from(revenueByCustomerMap).map(
        ([username, total_price]) => ({
          username,
          total_price,
        }),
      );

      return revenueByCustomerArray
        .sort((a, b) => b.total_price - a.total_price)
        .slice(0, top);
    } catch {
      throw new Error('Failed to get total revenue customer data');
    }
  }

  async GetTotalRevenueProduct(top: number = 5) {
    try {
      const revenueByProduct = await this.prismaDbService.order_Items.findMany({
        select: {
          product: true,
          total_price: true,
        },
      });

      const revenueByProductMap = new Map<any, number>();
      revenueByProduct.forEach((item) => {
        const { product, total_price } = item;
        const { product_name } = product;
        if (revenueByProductMap.has(product_name)) {
          revenueByProductMap.set(
            product_name,
            revenueByProductMap.get(product_name) + Number(total_price),
          );
        } else {
          revenueByProductMap.set(product_name, Number(total_price));
        }
      });

      const revenueByProductArray = Array.from(revenueByProductMap).map(
        ([product_name, total_price]) => ({
          product_name,
          total_price,
        }),
      );

      return revenueByProductArray
        .sort((a, b) => b.total_price - a.total_price)
        .slice(0, top);
    } catch {
      throw new Error('Failed to get total revenue product data');
    }
  }

  async GetTotalRevenue() {
    try {
      const order = await this.prismaDbService.orders.findMany({
        select: {
          total_price: true,
        },
      });
      return {
        total_price: order.reduce(
          (acc, order) => acc + Number(order.total_price),
          0,
        ),
      };
    } catch {
      throw new Error('Failed to get total revenue data');
    }
  }
  async GetInventoryStockAnalysisThisYear(year: number = 2024) {
    try {
      const monthlyRateAnalysis = [];

      for (let i = 1; i <= 12; i++) {
        const startDate = new Date(Date.UTC(year, i - 1, 1));
        const endDate = new Date(
          Date.UTC(year + (i === 12 ? 1 : 0), i % 12, 1),
        );

        // Fetch total imported items per product
        const importedItems = await this.prismaDbService.import_Items.groupBy({
          by: ['product_id'],
          where: {
            importation: {
              import_date: {
                gte: startDate,
                lt: endDate,
              },
            },
          },
          _sum: {
            quantity: true,
          },
        });

        // Fetch total sold items per product
        const soldItems = await this.prismaDbService.order_Items.groupBy({
          by: ['product_id'],
          where: {
            order: {
              created_at: {
                gte: startDate,
                lt: endDate,
              },
            },
          },
          _sum: {
            quantity: true,
          },
        });

        // Fetch product names in a single query
        const productIds = [
          ...new Set([
            ...importedItems.map((item) => item.product_id),
            ...soldItems.map((item) => item.product_id),
          ]),
        ];
        const products = await this.prismaDbService.products.findMany({
          where: { product_id: { in: productIds } },
          select: { product_id: true, product_name: true },
        });

        // Create a map for product names
        const productMap = new Map(
          products.map((product) => [product.product_id, product.product_name]),
        );

        // Create a map to calculate sell-through rates
        const rateMap = new Map<
          string,
          { imported: number; sold: number; rate: number }
        >();

        // Process imported items
        importedItems.forEach((item) => {
          const productId = item.product_id;
          const product_name = productMap.get(productId) || 'Unknown Product';
          const importedQuantity = item._sum.quantity || 0;

          if (!rateMap.has(product_name)) {
            rateMap.set(product_name, { imported: 0, sold: 0, rate: 0 });
          }
          const data = rateMap.get(product_name)!;
          data.imported += importedQuantity;
        });

        // Process sold items
        soldItems.forEach((item) => {
          const productId = item.product_id;
          const product_name = productMap.get(productId) || 'Unknown Product';
          const soldQuantity = item._sum.quantity || 0;

          if (!rateMap.has(product_name)) {
            rateMap.set(product_name, { imported: 0, sold: 0, rate: 0 });
          }
          const data = rateMap.get(product_name)!;
          data.sold += soldQuantity;
        });

        // Calculate sell-through rate for each product
        const rates = Array.from(rateMap.entries()).map(
          ([product_name, data]) => {
            const { imported, sold } = data;
            const rate = imported > 0 ? (sold / imported) * 100 : 0;
            return { product_name, imported, sold, rate };
          },
        );

        // Sort by sell-through rate
        rates.sort((a, b) => b.rate - a.rate);
        monthlyRateAnalysis.push({
          month: i,
          data: rates,
        });
      }

      return monthlyRateAnalysis;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get inventory stock analysis data');
    }
  }

  async GetDashboardData() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const totalCustomers = await this.GetTotalCustomer();
    const newCustomersThisMonth = await this.GetCustomerByDate(
      currentMonth,
      currentYear,
    );

    const revenueTopProductsByDate = await this.GetRevenueTopProductsByDate(
      currentMonth,
      currentYear,
      10,
    );
    const revenueByCategoryByDate = await this.GetRevenueByCategoryByDate(
      currentMonth,
      currentYear,
    );
    const revenueByCustomerThisMonth = await this.GetRevenueCustomerByDate(
      currentMonth,
      currentYear,
      10,
    );

    const totalRevenueCategory = await this.GetTotalRevenueCategory(10);
    const totalRevenueCustomer = await this.GetTotalRevenueCustomer(10);
    const totalRevenueProduct = await this.GetTotalRevenueProduct(10);

    const revenueThisYear = [];
    for (let i = 1; i <= 12; i++) {
      revenueThisYear.push(await this.GetRevenueByDate(i, currentYear));
    }

    const inventoryStockAnalysisThisYear =
      await this.GetInventoryStockAnalysisThisYear(currentYear);

    return {
      inventoryStockAnalysisThisYear1: inventoryStockAnalysisThisYear,

      revenueByCategoryThisMonth: revenueByCategoryByDate,
      revenueTopProductsThisMonth: revenueTopProductsByDate,
      newCustomerThisMonth: newCustomersThisMonth,
      revenueByCustomerThisMonth: revenueByCustomerThisMonth,

      revenueThisYear: revenueThisYear,
      totalCustomers: totalCustomers,
      inventoryStockAnalysisThisYear: inventoryStockAnalysisThisYear,

      totalRevenueCategory: totalRevenueCategory,
      totalRevenueCustomer: totalRevenueCustomer,
      totalRevenueProduct: totalRevenueProduct,
    };
  }
}
