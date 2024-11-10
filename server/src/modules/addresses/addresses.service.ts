import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class AddressesService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(createAddressDto: Prisma.Customer_AddressCreateInput) {
    try {
      await this.prismaDbService.customer_Address.updateMany({
        where: {
          customer_id: createAddressDto.customer.connect.customer_id,
        },
        data: {
          is_primary: false,
        },
      });

      const address = await this.prismaDbService.customer_Address.create({
        data: createAddressDto,
      });

      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error creating address');
    }
  }

  async findAll(customerId: string) {
    try {
      const addresses = await this.prismaDbService.customer_Address.findMany({
        where: {
          customer_id: customerId,
        },
      });

      return addresses;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error fetching addresses');
    }
  }

  async findOne(customerId: string, addressId: number) {
    try {
      const address = await this.prismaDbService.customer_Address.findUnique({
        where: {
          address_id: addressId,
          customer_id: customerId,
        },
      });

      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error fetching address');
    }
  }

  async update(
    customerId: string,
    addressId: number,
    updateAddressDto: Prisma.Customer_AddressUpdateInput,
  ) {
    try {
      if (updateAddressDto.is_primary) {
        await this.prismaDbService.customer_Address.updateMany({
          where: {
            customer_id: customerId,
            is_primary: true,
          },
          data: {
            is_primary: false,
          },
        });
      }
      const address = await this.prismaDbService.customer_Address.update({
        where: {
          address_id: addressId,
          customer_id: customerId,
        },
        data: updateAddressDto,
      });

      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error updating address');
    }
  }

  async remove(customerId: string, addressId: number) {
    try {
      const address = await this.prismaDbService.customer_Address.delete({
        where: {
          address_id: addressId,
          customer_id: customerId,
        },
      });

      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error deleting address');
    }
  }

  async removeAll(customerId: string) {
    try {
      const address = await this.prismaDbService.customer_Address.deleteMany({
        where: {
          customer_id: customerId,
        },
      });

      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error deleting all addresses');
    }
  }
}
