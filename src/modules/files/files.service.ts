import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticProductImage(name: string): string {
    const path = join(__dirname, '../../../static/uploads', name);
    if (!existsSync(path)) {
      throw new BadRequestException(`No product found with image ${name}`);
    }
    return path;
  }
}
