import { Injectable } from '@nestjs/common';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackPrismaDBService: PrismaDbService) {}

  async create(createFeedbackDto: Prisma.Product_FeedbacksCreateInput) {
    try {
      const feedback = await this.feedbackPrismaDBService.$transaction(
        async (prisma) => {
          return await prisma.product_Feedbacks.upsert({
            where: {
              product_id_customer_id: {
                product_id: createFeedbackDto.product.connect.product_id,
                customer_id: createFeedbackDto.customer.connect.customer_id,
              },
            },
            create: createFeedbackDto,
            update: createFeedbackDto,
          });
        },
      );

      return feedback;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(product_id: string) {
    try {
      const feedbacks =
        await this.feedbackPrismaDBService.product_Feedbacks.findMany({
          where: {
            product_id: product_id,
          },
        });
      return feedbacks;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(product_id: string, feedback_id: string) {
    try {
      const feedback =
        await this.feedbackPrismaDBService.product_Feedbacks.findFirst({
          where: {
            product_id: product_id,
            feedback_id: feedback_id,
          },
        });
      return feedback;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id: number,
    updateFeedbackDto: Prisma.Product_FeedbacksUpdateInput,
  ) {
    try {
      const feedback = await this.feedbackPrismaDBService.$transaction(
        async (prisma) => {
          return await prisma.product_Feedbacks.update({
            where: {
              product_id_customer_id: {
                product_id: updateFeedbackDto.product.connect.product_id,
                customer_id: updateFeedbackDto.customer.connect.customer_id,
              },
            },
            data: updateFeedbackDto,
          });
        },
      );
      return feedback;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(prdoduct_id: string, customer_id: string) {
    try {
      const feedback = await this.feedbackPrismaDBService.$transaction(
        async (prisma) => {
          return await prisma.product_Feedbacks.delete({
            where: {
              product_id_customer_id: {
                product_id: prdoduct_id,
                customer_id: customer_id,
              },
            },
          });
        },
      );
      return feedback;
    } catch (error) {
      console.log(error);
    }
  }

  async removeAll() {
    try {
      const feedback = await this.feedbackPrismaDBService.$transaction(
        async (prisma) => {
          return await prisma.product_Feedbacks.deleteMany({});
        },
      );
      return feedback;
    } catch (error) {
      console.log(error);
    }
  }
}
