import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';

import { v4 as uuid } from 'uuid';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { PUBLIC_FOLDER_PATH } from 'src/common/constant/path';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        // 5MB
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter(req, file, callback) {
        // const ext = extname(file.originalname);
        // if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
        //   return callback(
        //     new BadRequestException('Only images are allowed'),
        //     false,
        //   );
        // }

        return callback(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, cb) {
          cb(null, PUBLIC_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
