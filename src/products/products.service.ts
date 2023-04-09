import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private primaryKey = 1;

  create(createProductDto: CreateProductDto) {
    const product = new Product();
    product.id = this.primaryKey++;
    product.name = createProductDto.name;
    product.price = createProductDto.price;
    product.description = createProductDto.description;
    product.createdAt = new Date();
    product.updatedAt = product.createdAt;

    this.products.push(product);
    return product;
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find((product) => product.id === id);

    if(!product) {
      throw new BadRequestException("Cannot Find Product");
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
