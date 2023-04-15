import { BadRequestException, HttpException, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
      }
    })

    return product;
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id
      },
    });

    if(!product) {
      throw new BadRequestException("Cannot Find Product");
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (product.isLocked) {
      throw new HttpException("Product Is Locked", 423);
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        isLocked: updateProductDto.isLocked,
      },
    });

    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.findOne(id);

    await this.prisma.product.delete({
      where: {
        id: product.id,
      },
    });
  }
}


