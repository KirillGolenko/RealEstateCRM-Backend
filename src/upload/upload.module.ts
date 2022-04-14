import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { UploadService } from './upload.service';

@Module({
  providers: [UploadService],
  imports: [MulterModule.register({ dest: './uploads' })],
  exports: [UploadService],
})
export class UploadModule {}
