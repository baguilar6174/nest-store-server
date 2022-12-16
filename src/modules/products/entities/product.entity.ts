import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'tbl_products' })
export class Product {
  @ApiProperty({
    example: 'cd335645-f1f3-48c9-a62e-7dc2da50c8f8',
    description: 'Product identifier as uuid',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-shirt',
    description: 'Product name',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  title: string;

  @ApiProperty({
    example: 25.8,
    description: 'Product price',
  })
  @Column({ type: 'double precision', default: 0 })
  price: number;

  @ApiProperty({
    example: 'Product description',
    description: 'Product description',
    default: null,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 't-shirt',
    description: 'Product SLUG',
  })
  @Column({ type: 'text', unique: true })
  slug: string;

  @ApiProperty({
    example: 5,
    description: 'Product stock',
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL'],
    description: 'Product sizes',
  })
  @Column({ type: 'text', array: true })
  sizes: string[];

  @ApiProperty()
  @Column({ type: 'text' })
  gender: string;

  @ApiProperty()
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @ApiProperty()
  @OneToMany(
    (): typeof ProductImage => ProductImage,
    (productImage): Product => productImage.product,
    {
      cascade: true,
      eager: true,
    },
  )
  images?: ProductImage[];

  @ManyToOne((): typeof User => User, (user): Product => user.product, {
    eager: true,
  })
  user: User;

  @BeforeInsert()
  checkInsertSlug(): void {
    this.createSlug();
  }

  @BeforeUpdate()
  checkUpdateSlug(): void {
    this.createSlug();
  }

  createSlug(): void {
    if (!this.slug) this.slug = this.title;
    this.slug = this.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/gi, '_')
      .replace(/-+/g, '_')
      .replace(/^-|-$/g, '');
  }
}
