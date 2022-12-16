import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<string> {
    await this.deleteTables();
    const admin = await this.createUsers();
    await this.createProducts(admin);
    return 'SEED EXECUTED';
  }

  private async deleteTables(): Promise<void> {
    await this.productsService.removeAll();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async createUsers(): Promise<User> {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user): void => {
      users.push(this.userRepository.create(user));
    });
    const dbUsers = await this.userRepository.save(seedUsers);
    const admin = dbUsers[0];
    return admin;
  }

  private async createProducts(user: User): Promise<void> {
    await this.productsService.removeAll();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach((product): void => {
      insertPromises.push(this.productsService.create(product, user));
    });
    await Promise.all(insertPromises);
  }
}
