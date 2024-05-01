import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('files')
  @UseInterceptors(FilesInterceptor('files'))
  postImage(@UploadedFiles() files?: Array<Express.Multer.File>) {
    return {
      fileNames: files.map((file) => file.filename),
    };
  }
}
