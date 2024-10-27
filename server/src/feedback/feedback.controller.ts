import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Prisma } from '@prisma/client';
import { DeleteFeedbackDto } from './dto/delete-feedback.dto';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly prismaDbService: PrismaDbService,
  ) {}

  @Post(':product_id')
  async create(
    @Param('product_id') product_id: string,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ) {
    try {
      const existingFeedback =
        await this.prismaDbService.product_Feedbacks.findFirst({
          where: {
            product_id: product_id,
            customer_id: createFeedbackDto.customer_id,
          },
        });

      if (existingFeedback) {
        throw new BadRequestException('You have already given feedback');
      }

      const feedbackDto: Prisma.Product_FeedbacksCreateInput = {
        feedback: createFeedbackDto.feedback,
        rating: createFeedbackDto.rating,
        created_at: new Date(),
        product: {
          connect: {
            product_id: product_id,
          },
        },
        customer: {
          connect: {
            customer_id: createFeedbackDto.customer_id,
          },
        },
      };
      return this.feedbackService.create(feedbackDto);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error || 'Failed to create feedback');
    }
  }

  @Get(':product_id')
  async findAll(@Param('product_id') product_id: string) {
    try {
      const feedbacks = await this.feedbackService.findAll(product_id);
      return feedbacks;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to fetch all feedbacks');
    }
  }

  @Get(':product_id/:id')
  async findOne(
    @Param('product_id') product_id: string,
    @Param('id') feedback_id: string,
  ) {
    try {
      const feedback = await this.feedbackService.findOne(
        product_id,
        feedback_id,
      );
      return feedback;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to fetch feedback');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    try {
      const feedback = await this.feedbackService.update(
        +id,
        updateFeedbackDto,
      );
      return feedback;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to update feedback');
    }
  }

  @Delete(':product_id')
  async remove(
    @Param('product_id') product_id: string,
    @Body() customer: DeleteFeedbackDto,
  ) {
    try {
      const { customer_id } = customer;
      const feedback = await this.feedbackService.remove(
        product_id,
        customer_id,
      );
      return feedback;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to remove feedback');
    }
  }
}
