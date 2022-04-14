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

  async saveFiles(files: Express.Multer.File[]) {
    return await files.reduce(async (promisedAcc, current) => {
      const acc = await promisedAcc;
      const filePath = join(__dirname, '../../', current.path);

      const response = await this.client.upload({
        image: readFileSync(filePath),
        type: 'stream',
      });

      if (response.status === 200) {
        acc.push(response.data.link);
      }

      unlinkSync(filePath);

      return acc;
    }, Promise.resolve([]));
  }
}
