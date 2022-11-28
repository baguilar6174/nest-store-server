import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'tbl_product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  title: string;

  @Column({ type: 'double precision', default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'text', array: true })
  sizes: string[];

  @Column({ type: 'text' })
  gender: string;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @OneToMany(
    (): typeof ProductImage => ProductImage,
    (productImage): Product => productImage.product,
    {
      cascade: true,
      eager: true,
    },
  )
  images?: ProductImage[];

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
