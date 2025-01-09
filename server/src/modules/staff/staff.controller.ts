import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { Prisma } from '@prisma/client';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { handleImageJpgBaseString } from 'src/utils/image.utils';

@Controller('staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly prismaDbService: PrismaDbService,
  ) {}

  @Post()
  @Permissions(['staff-create'])
  async create(
    @Body()
    createStaffDto: CreateStaffDto,
  ) {
    try {
      const { account, image, ...rest } = createStaffDto;

      const existingAccount = await this.prismaDbService.accounts.findUnique({
        where: { email: account.email },
      });

      if (existingAccount) {
        throw new BadRequestException('Email already exists');
      }

      const staffDto: Prisma.StaffCreateInput = {
        ...rest,
        account: {
          connectOrCreate: {
            where: { email: account.email }, // Ensure to use the same unique identifier
            create: {
              email: account.email,
              password: account.password, // Adjust as necessary
              // Add other necessary fields here...
            },
          },
        },
      };

      let imageAvatar = null;
      if (image && image.url) {
        if (image.type === 'dev') {
          staffDto.image = image.url;
        } else {
          imageAvatar = await handleImageJpgBaseString(image);
          if (imageAvatar) {
            staffDto.image = imageAvatar;
          }
        }
      }

      const staff = await this.staffService.create(staffDto, imageAvatar);
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error || 'Creating staff failed');
    }
  }

  @Get()
  @Permissions(['staff-read'])
  async findAll(
    @Query('q') query: string,
    @Query('full_name') full_name: string,
    @Query('staff_id') staff_id: string,
    @Query('email') email: string,
  ) {
    try {
      const staff = await this.staffService.findAll(
        query,
        full_name,
        staff_id,
        email,
      );
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching all staff failed');
    }
  }

  @Get(':id')
  @Permissions(['staff-read'])
  async findOne(@Param('id') id: string) {
    try {
      const staff = await this.staffService.findOne(id);
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching staff failed');
    }
  }

  @Patch(':id')
  @Permissions(['staff-update'])
  async update(
    @Param('id') id: string,
    @Body()
    updateStaffDto: UpdateStaffDto,
  ) {
    try {
      const { role, image, ...rest } = updateStaffDto;

      const staffDto: Prisma.StaffUpdateInput = {
        ...rest,
        ...(role &&
          role.role_id > 0 && {
            role: {
              connect: {
                role_id: role.role_id,
              },
            },
          }),
      };

      let imageAvatar = null;
      if (image && image.url) {
        if (image.type === 'dev') {
          staffDto.image = image.url;
        } else {
          imageAvatar = await handleImageJpgBaseString(image);
          if (imageAvatar) {
            staffDto.image = imageAvatar;
          }
        }
      }
      const staff = await this.staffService.update(id, staffDto, imageAvatar);
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating staff failed');
    }
  }

  @Delete(':id')
  @Permissions(['staff-delete'])
  async remove(@Param('id') id: string) {
    try {
      const staff = await this.staffService.remove(id);
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting staff failed');
    }
  }
}
