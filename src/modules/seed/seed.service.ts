import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async seed(): Promise<string> {
    await this.createProducts();
    return 'SEED EXECUTED';
  }

  private async createProducts(): Promise<void> {
    await this.productsService.removeAll();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach((product): void => {
      insertPromises.push(this.productsService.create(product));
    });
    await Promise.all(insertPromises);
  }
}
