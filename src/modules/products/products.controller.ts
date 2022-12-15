import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto';
import { Product } from './entities/product.entity';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('products')
// @Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<{ total: number; result: any }> {
    return this.productsService.findAll(pagination);
  }

  @Get(':search')
  findOne(@Param('search') search: string): Promise<Product> {
    return this.productsService.findOne(search);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.productsService.remove(id);
  }
}
