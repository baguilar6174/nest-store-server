import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { PaginationQueryDto } from 'src/common/dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product: Product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll({
    limit = 10,
    offset = 0,
  }: PaginationQueryDto): Promise<{ total: number; result: any }> {
    const [result, total] = await this.productRepository.findAndCount({
      take: limit,
      skip: offset,
    });
    return { total, result };
  }

  async findOne(search: string): Promise<Product> {
    let product: Product;
    if (isUUID(search)) {
      product = await this.productRepository.findOneBy({
        id: search,
      });
    } else {
      const customQuery = this.productRepository.createQueryBuilder();
      product = await customQuery
        .where('slug =:slug', {
          slug: search,
        })
        .getOne();
    }
    if (!product) throw new NotFoundException(`Product not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product: Product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) throw new NotFoundException(`Product not found`);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<{ message: string }> {
    const product: Product = await this.findOne(id);
    await this.productRepository.remove(product);
    return {
      message: `The '${product.title}' product has been deleted`,
    };
  }
}
