import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'tbl_image' })
export class ProductImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, type: 'text' })
  url: string;

  @ManyToOne(
    (): typeof Product => Product,
    (product): ProductImage[] => product.images,
  )
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
