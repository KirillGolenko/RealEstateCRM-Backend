import { Injectable } from '@nestjs/common';
import { ImgurClient } from 'imgur';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

import * as config from 'config';

@Injectable()
export class UploadService {
  private readonly client: ImgurClient;

  constructor() {
    this.client = new ImgurClient({
      ...config.get('client'),
    });
  }
  async savePropertyImages(files: Express.Multer.File[]) {
    return await files.reduce(async (promisedAcc, current) => {
      const acc = await promisedAcc;
      const response = await this.saveFile(current);

      acc.push(response);

      return acc;
    }, Promise.resolve([]));
  }

  async saveFile(file: Express.Multer.File) {
    const filePath = join(__dirname, '../../', file.path);
    const response = await this.client.upload({
      image: readFileSync(filePath),
      type: 'stream',
    });
    unlinkSync(filePath);
    if (response.status === 200) {
      return response.data.link;
    }
  }
}
